<template>
  <div>
    <SuraText
      v-if="activeTab === 'suraText'"
      :suraTextArray="suraTextArray"
      :suraTargetedVerseIndex="suraTargetedVerseIndex"
      :numberOfLetters="numberOfLetters"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :inputText="inputText"
      :isLoading="isLoading"
    />
    <DashVerses
      v-if="activeTab === 'versesTab'"
      class="webKitWidth"
      :versesBasics="props.versesBasics"
      :inputText="inputText"
      :isLoading="isLoading"
    />
    <DashFrequency
      v-if="activeTab === 'frequency'"
      :chartFreqSeries="props.chartFreqSeries"
      :chartOptions="props.chartOptions"
      :versesText="props.suraTextArray"
      :isLoading="props.isLoading"
      :height="chartWindowHeight"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useQuranStore } from '@/stores/app'

const props = defineProps([
  'numberOfLetters',
  'chartFreqSeries',
  'numberOfVerses',
  'numberOfWords',
  'suraTextArray',
  'versesBasics',
  'chartOptions',
  'wordIndexes',
  'inputText',
  'isLoading',
])
const store = useQuranStore()

const activeTab = computed({
  get: () => store.getActiveTab,
  set: value => store.setActiveTab(value),
})
const changeTab = tab => {
  store.setActiveTab(tab)
}

const chartWindowHeight = computed(() => window.innerHeight.value - 210)
const suraTargetedVerseIndex = computed(() => store.getTarget.verseIndex || 1)

onMounted(() => {
  changeTab('versesTab')
})
</script>

<style>
.chartTitleWrap {
  zoom: 0.8;
  position: absolute;
  z-index: 3;
  margin-top: 3px !important;
  margin-right: 250px;
}
.dashboardTabs {
  margin-right: 395px;
  margin-top: -47px;
  margin-bottom: 1px;
  margin-left: 47px;
}
a.dashTabs.v-tab--active {
  background: aliceblue;
}
@media (max-width: 700px) {
}
@media (max-width: 978px) {
  .dashboardTabs {
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 14px;
  }
}
</style>
