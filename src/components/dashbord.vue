<template>
  <div>
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
          v-if="activeTab === 'frequency' && !searchFrequency"
          :isLoading="isLoading"
          :letterSeries="letterSeries"
          :wordsSeries="wordsSeries"
          :versesText="suraTextArray"
          :height="height"
      /><dashFrequencySearch
          v-if="activeTab === 'frequency' && searchFrequency"
          :isLoading="isLoading"
          :height="height"
          :versesBasics="versesBasics"
      />
      </keep-alive>
      <keep-alive
        ><dashWords
          class="webKitWidth"
          v-if="activeTab === 'numberOfWords'"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :indexes="wordIndexes"
          :suraText="suraTextArray.join(' ')"
          :isLoading="isLoading"
      /></keep-alive>
      <keep-alive
        ><dashLetters
          class="webKitWidth"
          v-if="activeTab === 'numberOfLetters'"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :suraText="suraTextArray.join('')"
          :isLoading="isLoading"
      /></keep-alive>
      <keep-alive
        ><dashVerses
          class="webKitWidth"
          v-if="activeTab === 'numberOfVerses'"
          :versesBasics="versesBasics"
          :inputText="inputText"
          :isLoading="isLoading"
      /></keep-alive>
    </v-row>
  </div>
</template>

<script>
import dashLetters from './dashLetters.vue'
import dashWords from './dashWords.vue'
import dashVerses from './dashVerses.vue'
import dashboardTab from './dashboardTab'
import dashFrequency from './dashFrequency'
import dashFrequencySearch from './dashFrequencySearch'

export default {
  name: 'dashbord',
  components: {
    dashLetters,
    dashboardTab,
    dashWords,
    dashVerses,
    dashFrequency,
    dashFrequencySearch
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
    'suraTextArray',
    'versesBasics',
    'activeTab',
    'searchFrequency'
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
a.dashTabs.v-tab--active {
    background: aliceblue;
}
@media (max-width: 700px) {
  .suraInfoSingleBox {
    width: 70.5px;
    margin-left: 10px;
    font-size: 13px;
  }
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
