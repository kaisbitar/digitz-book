<template>
  <AppToolbar
    :tabs="tabs"
    :activeTab="activeTab"
    :search="search"
    :searchBtnText="searchBtnText"
    :placeholderText="`سورة ${suraName}`"
    :countBadgeText="`${filteredVerses.length} آية`"
    :isInputVisible="isInputVisible"
    @update:activeTab="updateActiveTab"
    @update:search="updateSearch"
    @searchToggle="onSearchToggle"
    @enter="handleEnterPress"
  >
    <template #additional-actions>
      <AppFilterActions
        v-if="activeTab === 'versesTab' && !isInputVisible"
        v-show="$vuetify.display.mdAndUp"
      />
    </template>
  </AppToolbar>

  <v-window v-model="activeTab">
    <v-window-item value="suraText" @before-enter="scrollToActiveVerse">
      <SuraText
        ref="suraTextRef"
        :inputText="search"
        :suraTextArray="suraWithTashkeel"
      />
    </v-window-item>

    <v-window-item value="versesTab" @before-enter="scrollToActiveVerse">
      <VersesOverview
        ref="VersesOverviewRef"
        :verses="filteredVerses"
        :versesInputText="search"
        @verseSelected="handleVerseSelected"
      />
    </v-window-item>

    <v-window-item value="frequency">
      <SuraFrequency
        class="mt-2 mb-n2"
        :chartFreqSeries="chartFreqSeries"
        :chartOptions="chartOptions"
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
  search: String,
  suraName: String,
  suraWithTashkeel: Array,
  versesBasics: Array,
  chartFreqSeries: Array,
  chartOptions: Object,
})

const emit = defineEmits(["update:search", "verseSelected"])
const searchBtnText = ref(`ترتيل ${props.suraName}`)
const isInputVisible = ref(false)

const filteredVerses = computed(() => {
  if (!props.search) return props.versesBasics
  return props.versesBasics
    .filter((verse) => verse.verseText.includes(props.search))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const updateSearchValue = (value) => {
  emit("update:search", value)
}

const handleVerseSelected = (verse) => {
  emit("verseSelected", verse)
}

const onSearchToggle = (value) => {
  isInputVisible.value = value
}

const handleEnterPress = (value) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: filteredVerses.value[0].index,
    verseNumberToQuran: filteredVerses.value[0].verseNumberToQuran,
  })
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
    VersesOverviewRef.value.tablesScroll()
  })
}

const updateActiveTab = (value) => {
  store.setActiveSuraTab(value)
}

const updateSearch = (value) => {
  searchBtnText.value = props.search
  emit("update:search", value)
  if (value === "" || value === null) {
    searchBtnText.value = `ترتيل ${props.suraName}`
  }
}
</script>
