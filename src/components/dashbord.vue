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
    <v-tabs v-model="activeTab" class="webKitWidth">
      <v-tab
        transition="fade-transition"
        reverse-transition="fade-transition"
        key="numberOfVerses"
        value="numberOfVerses"
      >
        <dashVerses
          v-if="activeTab === 'numberOfVerses'"
          class="webKitWidth"
          :versesBasics="versesBasics"
          :inputText="inputText"
          :isLoading="isLoading"
        />
      </v-tab>
      <v-tab
        transition="fade-transition"
        reverse-transition="fade-transition"
        key="numberOfWords"
        value="numberOfWords"
      >
        <dashWords
          v-if="activeTab === 'numberOfWords'"
          class="webKitWidth"
          :suraText="suraTextArray.join(' ')"
          :numberOfLetters="numberOfLetters"
          :numberOfWords="numberOfWords"
          :isLoading="isLoading"
          :indexes="wordIndexes"
      /></v-tab>
      <v-tab
        transition="fade-transition"
        reverse-transition="fade-transition"
        key="numberOfLetters"
        value="numberOfLetters"
      >
        <dashLetters
          v-if="activeTab === 'numberOfLetters'"
          class="webKitWidth"
          :numberOfLetters="numberOfLetters"
          :suraText="suraTextArray.join('')"
          :numberOfWords="numberOfWords"
          :isLoading="isLoading"
        />
      </v-tab>
      <dashFrequency
        v-if="activeTab === 'frequency'"
        :chartFreqSeries="chartFreqSeries"
        :chartOptions="chartOptions"
        :versesText="suraTextArray"
        :isLoading="isLoading"
        :height="height"
      />
    </v-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useQuranStore } from '@/stores/app'
import DashLetters from './dashLetters.vue'
import DashFrequency from './dashFrequency.vue'
import DashVerses from './dashVerses.vue'
import DashboardTabs from './dashboardTabs.vue'
import DashWords from './dashWords.vue'

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
console.log(props)
const store = useQuranStore()
const windowHeight = ref(window.innerHeight)

const changeTab = tab => {
  store.setActiveTab(tab)
}

const tabs = computed(() => [
  { title: 'آية', value: props.numberOfVerses, name: 'numberOfVerses' },
  { title: 'كلمة', value: props.numberOfWords, name: 'numberOfWords' },
  { title: 'حرف', value: props.numberOfLetters, name: 'numberOfLetters' },
  { title: 'تواتر', name: 'frequency' },
])

const activeTab = computed(() => store.getActiveTab)

const height = computed(() => windowHeight.value - 210)

onMounted(() => {
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
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
  margin-top: -37px;
  margin-bottom: -1px;
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
    margin-bottom: 10px;
  }
}
</style>
