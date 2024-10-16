<template>
  <v-toolbar class="mb-1">
    <AppTabs :tabs="tabs" v-model:activeTab="activeTab" />
    <AppInputFieldToggle
      :fieldInput="search"
      :fieldPlaceHolder="`سورة ${suraName}`"
      :showFilterActions="showFilterActions"
      @update:fieldInput="updateSearchValue"
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
        :verses="versesBasics"
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
import { ref, nextTick } from "vue"
import { useWindow } from "@/mixins/window"

const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  suraName: String,
  showFilterActions: Boolean,
  suraWithTashkeel: Array,
  versesBasics: Array,
  chartFreqSeries: Array,
  chartOptions: Object,
})

const emit = defineEmits(["update:activeTab", "update:search", "verseSelected"])

const updateSearchValue = (value) => {
  emit("update:search", value)
}

const handleVerseSelected = (verse) => {
  emit("verseSelected", verse)
}

const activeTab = computed({
  get: () => props.activeTab,
  set: (value) => emit("update:activeTab", value),
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
