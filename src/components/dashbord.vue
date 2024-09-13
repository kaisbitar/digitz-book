<template>
  <div>
    <v-row class="dashboardTabs">
      <dashboardTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @tabChanged="changeTab"
        class="webKitWidth"
      />
    </v-row>
    <!-- {{ suraTargetedVerseIndex }} -->
    <!-- <suraText
      v-if="activeTab === 'suraText'"
      :suraTextArray="suraTextArray"
      :suraTargetedVerseIndex="suraTargetedVerseIndex"
      :numberOfLetters="numberOfLetters"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :inputText="inputText"
      :isLoading="isLoading"
    /> -->
    <dashVerses
      v-if="activeTab === 'numberOfVerses'"
      class="webKitWidth"
      :versesBasics="props.versesBasics"
      :inputText="props.inputText"
      :isLoading="props.isLoading"
    />
    <!-- <dashWords
      v-if="activeTab === 'numberOfWords'"
      class="webKitWidth"
      :suraText="suraTextArray.join(' ')"
      :numberOfLetters="props.numberOfLetters"
      :numberOfWords="props.numberOfWords"
      :isLoading="props.isLoading"
      :indexes="props.wordIndexes"
    />
    <dashLetters
      v-if="activeTab === 'numberOfLetters'"
      class="webKitWidth"
      :numberOfLetters="props.numberOfLetters"
      :suraText="suraTextArray.join('')"
      :numberOfWords="props.numberOfWords"
      :isLoading="props.isLoading"
    /> -->
    <dashFrequency
      v-if="activeTab === 'frequency'"
      :chartFreqSeries="props.chartFreqSeries"
      :chartOptions="props.chartOptions"
      :versesText="props.suraTextArray"
      :isLoading="props.isLoading"
      :height="height"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useQuranStore } from '@/stores/app'
import dashLetters from './dashLetters.vue'
import dashFrequency from './dashFrequency.vue'
import dashVerses from './dashVerses.vue'
import dashboardTabs from './dashboardTabs.vue'
import dashWords from './dashWords.vue'
import suraText from '@/components/suraText.vue'

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
const windowHeight = ref(window.innerHeight)

const tabs = computed(() => [
  { title: 'نص', name: 'suraText' },
  { title: 'آية', value: props.numberOfVerses, name: 'numberOfVerses' },
  { title: 'كلمة', value: props.numberOfWords, name: 'numberOfWords' },
  { title: 'حرف', value: props.numberOfLetters, name: 'numberOfLetters' },
  { title: 'تواتر', name: 'frequency' },
])
const activeTab = computed({
  get: () => store.getActiveTab,
  set: value => store.setActiveTab(value),
})
const changeTab = tab => {
  store.setActiveTab(tab)
}

const height = computed(() => windowHeight.value - 210)
const suraTargetedVerseIndex = computed(() => store.getTarget.verseIndex || 1)

onMounted(() => {
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
  changeTab('numberOfVerses')
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
  margin-bottom: 15px;
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
