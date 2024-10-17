<template>
  <v-toolbar class="mb-1">
    <AppTabs
      v-if="!isInputVisible"
      :tabs="tabs"
      v-model:activeTab="activeTab"
    />
    <AppInputField
      v-if="isInputVisible"
      :fieldInput="search"
      :fieldPlaceHolder="`سورة ${suraName}`"
      :dataToShow="filteredVerses.length"
      @update:fieldInput="updateSearchValue"
    />
    <v-spacer></v-spacer>
    <AppToggleBtn
      :isVisible="isInputVisible"
      :button-text="`ابحث في ${suraName}`"
      @toggle="isInputVisible = !isInputVisible"
    />
    <AppFilterActions
      v-if="activeTab === 'versesTab' && !isInputVisible"
      v-show="$vuetify.display.mdAndUp"
    />
  </v-toolbar>

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
        :chartFreqSeries="chartFreqSeries"
        :chartOptions="chartOptions"
      />
    </v-window-item>
  </v-window>
</template>

<script setup>
import { ref, nextTick, computed } from "vue"
import { useWindow } from "@/mixins/window"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
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
</script>
