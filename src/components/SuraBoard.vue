<template>
  <SuraHeader v-if="!isInputVisible" class="flex-wrap mb-4" />
  <SuraToolbar
    :tabs="tabs"
    :activeTab="activeTab"
    :search="inputText"
    :searchBtnText="searchBtnText"
    :placeholderText="`سورة ${suraName}`"
    :isInputVisible="isInputVisible"
    :badgeIsActive="!!inputText"
    :badgeContent="badgeContent"
    :currentIndex="currentIndex"
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

const emit = defineEmits([, "verseSelected"])
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

const targetTarteel = computed(() => store.getTarget?.tarteel)

const tagetedVerseIndex = computed(() => {
  return store.getTarget.verseIndex
})

watch(tagetedVerseIndex, () => {
  scrollToActiveVerse()
})

const onVerseSelected = (verse) => {
  emit("verseSelected", verse)
}

const onSearchToggle = (value) => {
  isInputVisible.value = value
}

const onEnter = (value) => {
  if (value === "") {
    setTargetVerse(props.versesBasics[0])
    return
  }
  navigateVerses()
}

const onInput = (value) => {
  inputText.value = value
  searchBtnText.value = value || `ترتيل ${props.suraName}`
  currentIndex.value = -1
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

const navigateVerses = (direction) => {
  const isUp = direction === "up"
  const lastIndex = filteredVerses.value.length - 1

  if (isUp && currentIndex.value <= 0) return
  if (!isUp && currentIndex.value >= lastIndex) {
    currentIndex.value = 0
    return setTargetVerse(filteredVerses.value[currentIndex.value])
  }

  currentIndex.value += isUp ? -1 : 1
  setTargetVerse(filteredVerses.value[currentIndex.value])
}

const handleClickUp = () => navigateVerses("up")
const handleClickDown = () => navigateVerses("down")

onMounted(() => {
  if (targetTarteel.value) {
    inputText.value = targetTarteel.value
    isInputVisible.value = true
  }
  scrollToActiveVerse()
  searchBtnText.value = inputText.value
})

const setTargetVerse = (verse) => {
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex || 0,
    verseNumberToQuran: verse.verseNumberToQuran,
    verseText: verse.verseText,
  })
}
</script>

<style scoped></style>
