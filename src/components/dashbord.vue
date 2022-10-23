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
    <v-tabs-items v-model="activeTab" class="webKitWidth">
      <v-tab-item
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
      </v-tab-item>
      <v-tab-item
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
      /></v-tab-item>
      <v-tab-item
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
      </v-tab-item>
      <dashFrequency
        v-if="activeTab === 'frequency'"
        :chartFreqSeries="chartFreqSeries"
        :chartOptions="chartOptions"
        :versesText="suraTextArray"
        :isLoading="isLoading"
        :height="height"
      />
    </v-tabs-items>
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
    'versesBasics',
    'chartOptions',
    'wordIndexes',
    'inputText',
    'isLoading'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    tab: 'numberOfVerses'
  }),
  methods: {
    changeTab (tab) {
      this.tab = tab
      this.$store.commit('setActiveTab', tab)
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
    activeTab () {
      return this.$store.getters.activeTab
    },
    height () {
      var heightDif = this.windowHeight - 210
      return heightDif
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
