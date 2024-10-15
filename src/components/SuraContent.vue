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
    <v-window-item value="suraText">
      <SuraText :inputText="search" :suraTextArray="suraWithTashkeel" />
    </v-window-item>

    <v-window-item value="versesTab">
      <TableVerses
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
</script>
