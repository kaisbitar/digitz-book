<template>
  <label>
    <v-row class="dashboardTab">
      <dashboardTab
        v-for="(item, index) in tabs"
        :key="index"
        :title="item.title"
        :value="item.value"
        :tabName="item.name"
        :activeTab="activeTab === item.name"
      />
    </v-row>
    <v-row>
      <keep-alive
        ><dashFrequency
          v-if="activeTab === 'frequency'"
          :isLoading="isLoading"
          :letterSeries="letterSeries"
          :wordsSeries="wordsSeries"
          :versesText="suraTextarray"
          :height="height"
      /></keep-alive>
      <keep-alive
        ><dashWords
          class="chartRow"
          v-if="activeTab === 'numberOfWords'"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :indexes="wordIndexes"
          :suraText="suraTextarray.join(' ')"
          :isLoading="isLoading"
      /></keep-alive>
      <keep-alive
        ><dashLetters
          class="chartRow"
          v-if="activeTab === 'numberOfLetters'"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :suraText="suraTextarray.join('')"
          :isLoading="isLoading"
      /></keep-alive>
      <keep-alive
        ><dashVerses
          class="chartRow"
          v-if="activeTab === 'numberOfVerses'"
          :versesBasics="versesBasics"
          :inputText="inputText"
          :isLoading="isLoading"
      /></keep-alive>
    </v-row>
  </label>
</template>

<script>
import dashLetters from './dashLetters.vue'
import dashWords from './dashWords.vue'
import dashVerses from './dashVerses.vue'
import dashboardTab from './dashboardTab'
import dashFrequency from './dashFrequency'

export default {
  name: 'dashbord',
  components: {
    dashLetters,
    dashboardTab,
    dashWords,
    dashVerses,
    dashFrequency
  },
  props: [
    'inputText',
    'numberOfVerses',
    'numberOfWords',
    'numberOfLetters',
    'isLoading',
    'wordIndexes',
    'letterSeries',
    'wordsSeries',
    'suraTextarray',
    'versesBasics',
    'activeTab'
  ],
  data: () => ({
    dataType: 'الكلمة',
    windowHeight: window.innerHeight
  }),
  methods: {},
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
      // var tabgetHeight ()Height = 0
      // if (this.includeTab) { tabHeight = -20 }
      var heightDif = this.windowHeight - 210
      return heightDif
    }
  },
  watch: {},
  created () {},
  mounted () {
    this.$store.commit('setNumberInfoShow', false)
  }
}
</script>

<style>
.suraInfoSingleBox {
  padding: 24px;
  margin-left: 9px;
  width: 130.5px;
  display: flex;
  color: #fff;
  opacity: 0.5;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
}
.suraInfoSingleBox.active {
  opacity: 1;
  /* border: 1px solid #626262 !important; */
}
.chartRow {
  width: -webkit-fill-available;
}
.chartTitleWrap {
  zoom: 0.8;
  position: absolute;
  z-index: 3;
  margin-top: 3px !important;
  margin-right: 250px;
}
.dashboardTab {
  margin-right: 395px;
  margin-top: -66px;
  margin-bottom: 16px;
}
@media (max-width: 978px) {
  .dashboardTab {
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 10px;
  }
  .suraInfoSingleBox {
    padding: 5px;
    margin-bottom: 5px;
  }
}
</style>
