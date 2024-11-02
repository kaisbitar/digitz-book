<template>
  <div :style="{ height: isInputVisible ? '0px' : '59px' }">
    <v-slide-x-transition mode="out-in">
      <SuraHeader v-if="!isInputVisible" class="flex-wrap mb-4" />
    </v-slide-x-transition>
  </div>
  <SuraToolbar
    :tabs="tabs"
    :activeTab="activeTab"
    :search="inputText"
    :searchBtnText="searchBtnText"
    :placeholderText="`سورة ${suraName}`"
    :isInputVisible="isInputVisible"
    :badgeIsActive="!!inputText"
    :badgeContent="badgeContent"
    :inputIndex="inputIndex"
    @update:activeTab="updateActiveTab"
    @update:search="onInput"
    @searchToggle="onSearchToggle"
    @enter="onEnter"
    @navigate-up="handleClickUp"
    @navigate-down="handleClickDown"
  >
    <template #additional-actions>
      <AppFilterActions
        v-if="activeTab === 'versesTab'"
        v-show="!$vuetify.display.xs"
      />
    </template>
  </SuraToolbar>

  <v-window v-model="activeTab">
    <v-window-item value="suraText" @before-enter="scrollToActiveVerse">
      <SuraText
        ref="suraTextRef"
        :inputText="inputText"
        :suraTextArray="suraWithTashkeel"
      />
    </v-window-item>

    <v-window-item value="versesTab" @before-enter="scrollToActiveVerse">
      <VersesOverview
        ref="VersesOverviewRef"
        :verses="versesBasics"
        :versesInputText="inputText"
        @verseSelected="onVerseSelected"
      />
    </v-window-item>

    <v-window-item value="frequency">
      <SuraFrequency
        class="mt-2 mb-n2"
        :verses="versesBasics"
        :chartFreqSeries="chartFreqSeries"
        :versesBasics="versesBasics"
      />
    </v-window-item>
  </v-window>
</template>

<script setup>
import { ref, nextTick, computed } from "vue"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"

const store = useStore()
const props = defineProps({
  tabs: Array,
  suraName: String,
  suraWithTashkeel: Array,
  versesBasics: Array,
  chartFreqSeries: Array,
  chartOptions: Object,
})

const emit = defineEmits(["verseSelected"])
const searchBtnText = ref(`ترتيل ${props.suraName}`)
const isInputVisible = ref(false)
const inputText = ref("")

const filteredVerses = computed(() => {
  if (!inputText.value) return []
  return props.versesBasics
    .filter((verse) => verse.verseText.includes(inputText.value))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const badgeContent = computed(() => {
  return filteredVerses.value.length ? `${filteredVerses.value.length}` : ""
})

const inputIndex = computed(() => {
  return currentIndex.value >= 0 ? currentIndex.value + 1 : 0
})

const targetTarteel = computed(() => store.getTarget?.tarteel)

const targetNumberToQuran = computed(() => {
  return store.getTarget.verseNumberToQuran
})

watch(targetNumberToQuran, () => {
  scrollToActiveVerse()
})

const onVerseSelected = (verse) => {
  setTargetVerse(verse)
  emit("verseSelected", verse)
}

const onSearchToggle = (value) => {
  isInputVisible.value = value
}

const activeTab = computed({
  get: () => store.getActiveSuraTab,
  set: (value) => store.setActiveSuraTab(value),
})

const suraTextRef = ref(null)
const VersesOverviewRef = ref(null)
const { scrollToActiveItem } = useWindow()

const scrollToActiveVerse = () => {
  nextTick(() => {
    if (activeTab.value === "suraText" && suraTextRef.value) {
      scrollToActiveItem(".active-verse-text", ".sura-text-container")
      return
    }
    if (activeTab.value === "versesTab" && VersesOverviewRef.value) {
      VersesOverviewRef.value.tablesScroll()
    }
  })
}

const updateActiveTab = (value) => {
  store.setActiveSuraTab(value)
}

const currentIndex = ref(0)
const handleClickUp = () => navigateVerses("up")
const handleClickDown = () => navigateVerses("down")

const navigateVerses = (direction) => {
  if (!filteredVerses.value.length) {
    return
  }

  if (direction === "up") {
    if (currentIndex.value <= 0) {
      currentIndex.value = filteredVerses.value.length - 1
      return setTargetVerse(filteredVerses.value[currentIndex.value])
    }

    currentIndex.value--
    return setTargetVerse(filteredVerses.value[currentIndex.value])
  }

  if (currentIndex.value >= filteredVerses.value.length - 1) {
    currentIndex.value = -1
  }

  currentIndex.value++
  return setTargetVerse(filteredVerses.value[currentIndex.value])
}

const onEnter = (value) => {
  if (value === "") {
    setTargetVerse(props.versesBasics[0])
    return
  }
  navigateVerses("down")
}

const onInput = (value) => {
  inputText.value = value
  searchBtnText.value = value || `ترتيل ${props.suraName}`
  currentIndex.value = -1
  setTimeout(() => {
    navigateVerses("down")
  }, 100)
}

const handleLanding = async () => {
  if (targetTarteel.value) {
    inputText.value = targetTarteel.value
    searchBtnText.value = inputText.value

    await nextTick()
    filteredVerses.value.map((verse, index) => {
      if (verse.verseNumberToQuran == targetNumberToQuran.value) {
        currentIndex.value = index
      }
    })

    setTimeout(() => {
      isInputVisible.value = true
    }, 1000)
  }
}

onMounted(() => {
  handleLanding()
  scrollToActiveVerse()
})

const setTargetVerse = (verse) => {
  store.setTarget({
    ...verse,
    tarteel: inputText.value,
  })
}
</script>

<style scoped></style>
