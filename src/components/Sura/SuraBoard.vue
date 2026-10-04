<template>
  <SuraHeader
    class="flex-wrap mb-4"
    :isToolbarExpanded="isToolbarExpanded"
    @expandedToggle="isToolbarExpanded = !isToolbarExpanded"
  />
  <div class="d-flex align-center flex-wrap">
    <AppTabs
      v-if="isToolbarExpanded"
      class="flex-shrink-0"
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <SuraInputField
      :search="inputText"
      :placeholderText="`سورة ${suraName}`"
      :badgeContent="badgeContent"
      :inputIndex="inputIndex"
      class="ms-auto"
      @update:search="onInput"
      @enter="onEnter"
      @navigate-up="handleClickUp"
      @navigate-down="handleClickDown"
    />
  </div>

  <v-window v-model="activeTab" class="input-visible" :touch="false">
    <v-window-item
      value="suraText"
      @before-enter="scrollToActiveVerse"
      class="bg-surface"
    >
      <SuraText
        ref="suraTextRef"
        :inputText="inputText"
        :versesBasics="versesBasics"
        @verseSelected="onVerseSelected"
      />
    </v-window-item>

    <v-window-item value="versesTab" @before-enter="scrollToActiveVerse">
      <AppTableToggle class="table-toggle-container" />
      <VersesOverview
        class="px-sm-3"
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
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useHideOnScroll } from "@/hooks/useHideOnScroll"
import { createArabicPattern } from "@/utils/arabicUtils"

const router = useRouter()
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
const inputText = ref("")
const isToolbarExpanded = ref(true)
const isHeaderVisible = useHideOnScroll()

const filteredVerses = computed(() => {
  if (!inputText.value) return []

  const regex = createArabicPattern(inputText.value)

  return props.versesBasics
    .filter((verse) => regex.test(verse.verseText))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const badgeContent = computed(() => {
  return filteredVerses.value.length ? `${filteredVerses.value.length}` : "0"
})

const inputIndex = computed(() => {
  return currentIndex.value >= 0 ? currentIndex.value + 1 : 0
})

const targetTarteel = computed(() => store.getTarget?.tarteel)

const targetNumberToQuran = computed(() => {
  return store.getTarget.verseNumberToQuran
})

const onVerseSelected = (verse) => {
  setTargetVerse(verse)
  emit("verseSelected", verse)
}

const activeTab = computed({
  get: () => store.getActiveSuraTab,
  set: (value) => store.setActiveSuraTab(value),
})

const suraTextRef = ref(null)
const VersesOverviewRef = ref(null)
const { scrollToActiveItem } = useWindow()

const scrollToActiveVerse = () => {
  if (activeTab.value === "suraText" && suraTextRef.value) {
    scrollToActiveItem(".active-verse-text", ".sura-text-container")
    return
  }
  if (activeTab.value === "versesTab" && VersesOverviewRef.value) {
    VersesOverviewRef.value.tablesScroll()
  }
}

const updateActiveTab = (value) => {
  store.setActiveSuraTab(value)
}

const currentIndex = ref(0)
const handleClickUp = () => {
  setVerse("up")
  setRoute()
}
const handleClickDown = () => {
  setVerse("down")
  setRoute()
}
const setRoute = () => {
  const query = { ...router.currentRoute.value.query }
  const verse = filteredVerses.value[currentIndex.value]
  if (!verse) return
  router.push({
    path: `/sura/${verse.suraNumber}/${verse.verseIndex}`,
    query,
  })
}
const setVerse = (direction) => {
  scrollToActiveVerse()
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
  setVerse("down")
  setRoute()
}

const onInput = (value) => {
  inputText.value = value
  searchBtnText.value = value || `ترتيل ${props.suraName}`
  currentIndex.value = -1
  setTimeout(() => {
    setVerse("down")
    setRoute()
  }, 100)
}

watch(targetTarteel, (value) => {
  const next = value || ""
  if (next === inputText.value) return
  inputText.value = next
  searchBtnText.value = next || `ترتيل ${props.suraName}`
})

const handleLanding = async () => {
  if (!targetTarteel.value) {
    return
  }
  inputText.value = targetTarteel.value
  searchBtnText.value = inputText.value

  await nextTick()
  filteredVerses.value.map((verse, index) => {
    if (verse.verseNumberToQuran == targetNumberToQuran.value) {
      currentIndex.value = index
    }
  })
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

<style scoped>
.input-visible {
  /* App bar, page padding, sura title, tabs and search on one row */
  --content-height: calc(100vh - var(--v-layout-top) - 16px - 57px - 48px);
}

.sura-board-overflow {
  height: var(--content-height);
  overflow: auto;
}

.table-toggle-container {
  position: absolute;
  left: 03px;
  top: 4px;
  z-index: 100;
}
</style>
