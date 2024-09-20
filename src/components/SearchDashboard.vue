<template>
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
    <SearchVerses
      v-if="activeTab === 'versesTab'"
      class="webKitWidth"
      :versesBasics="props.versesBasics"
      :inputText="inputText"
      :isLoading="isLoading"
    />
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
a.dashTabs.v-tab--active {
  background: aliceblue;
}
</style>
