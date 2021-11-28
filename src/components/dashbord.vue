<template>
  <div>
    <v-row class="dashboardTabs">
      <dashboardTabs :tabs="tabs" @tabChanged="changeTab" class="webKitWidth"/>
    </v-row>
    <v-row>
      <v-tabs-items v-model="tab" class="webKitWidth">
        <v-tab-item
          transition="fade-transition" reverse-transition="fade-transition"
        >
          <keep-alive>
            <dashVerses
              v-if="activeTabName === 'numberOfVerses'"
              class="webKitWidth"
              :versesBasics="versesBasics"
              :inputText="inputText"
              :isLoading="isLoading"
          /></keep-alive>
        </v-tab-item>
        <v-tab-item
          transition="fade-transition" reverse-transition="fade-transition"
        >
          <dashWords
            v-if="activeTabName === 'numberOfWords'"
            class="webKitWidth"
            :suraText="suraTextArray.join(' ')"
            :numberOfLetters="numberOfLetters"
            :numberOfWords="numberOfWords"
            :isLoading="isLoading"
            :indexes="wordIndexes"
        /></v-tab-item>
        <v-tab-item
          transition="fade-transition" reverse-transition="fade-transition"
        >
          <dashLetters
            v-if="activeTabName === 'numberOfLetters'"
            class="webKitWidth"
            :numberOfLetters="numberOfLetters"
            :suraText="suraTextArray.join('')"
            :numberOfWords="numberOfWords"
            :isLoading="isLoading"
        /></v-tab-item>
          <dashFrequency
            v-if="activeTabName === 'frequency'"
            :chartFreqSeries="chartFreqSeries"
            :chartOptions="chartOptions"
            :versesText="suraTextArray"
            :isLoading="isLoading"
            :height="height"
        />
      </v-tabs-items>
    </v-row>
  </div>
</template>

<script>
import dashLetters from './dashLetters.vue'
import dashFrequency from './dashFrequency'
import dashVerses from './dashVerses.vue'
import dashboardTabs from './dashboardTabs'
import dashWords from './dashWords.vue'

export default {
  name: 'dashbord',
  components: {
    dashFrequency,
    dashboardTabs,
    dashLetters,
    dashVerses,
    dashWords
  },
  props: [
    'numberOfLetters',
    'chartFreqSeries',
    'numberOfVerses',
    'numberOfWords',
    'suraTextArray',
    'chartFreqType',
    'versesBasics',
    'chartOptions',
    'wordIndexes',
    'inputText',
    'isLoading',
    'activeTab'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    tab: 3
  }),
  methods: {
    changeTab (tab) {
      this.tab = tab
    }
  },
  computed: {
    tabs () {
      var tabs = [
        { title: 'آية', value: this.numberOfVerses, name: 'numberOfVerses' },
        { title: 'كلمة', value: this.numberOfWords, name: 'numberOfWords' },
        { title: 'حرف', value: this.numberOfLetters, name: 'numberOfLetters' },
        { title: 'تواتر', name: 'frequency' }
      ]
      return tabs
    },
    height () {
      var heightDif = this.windowHeight - 210
      return heightDif
    },
    activeTabName () {
      if (!this.activeTab) return
      return this.activeTab.name
    }
  },
  watch: {},
  created () {},
  mounted () {}
}
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
