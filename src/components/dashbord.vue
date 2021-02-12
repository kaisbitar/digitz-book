<template>
  <label>
    <v-row class="dashboardTab">
      <dashboardTab
        v-for="(item, index) in tabs"
        :key="index"
        :title="item.title"
        :value="item.value"
        :activeTab="activeTab === item.name"
        @selected="activate(item.name)"
      />
    </v-row>
    <v-row>
        <chartFrequency
        v-if="activeTab === 'frequency'"
        :isLoading="isLoading"
        :letterSeries="letterSeries"
        :wordsSeries="wordsSeries"
        :height="getHeight()"
        />

      <dashWords
        class="chartRow"
        v-if="activeTab === 'numberOfWords'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :indexes="wordIndexes"
        :occurrences="wordOccurrences"
        :isLoading="isLoading"
      />
      <dashLetters
        class="chartRow"
        v-if="activeTab === 'numberOfLetters'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :indexes="letterIndexes"
        :occurrences="letterOccurrences"
        :isLoading="isLoading"
      />
       <dashVerses
        class="chartRow"
        v-if="activeTab === 'numberOfVerses'"
        :versesBasics="versesBasics"
        :isLoading="isLoading"
      />
    </v-row>
  </label>
</template>

<script>
import dashLetters from './dashLetters.vue'
import dashWords from './dashWords.vue'
import dashVerses from './dashVerses.vue'
import dashboardTab from './dashboardTab'
import chartFrequency from './chartFrequency'

export default {
  name: 'dashbord',
  components: { dashLetters, dashboardTab, dashWords, dashVerses, chartFrequency },
  props: [
    'title',
    'numberOfVerses',
    'numberOfWords',
    'numberOfLetters',
    'isLoading',
    'wordIndexes',
    'wordOccurrences',
    'letterIndexes',
    'letterOccurrences',
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
  methods: {
    activate (el) {
      // this.activeTab = el
      this.$emit('tabChanged', el)
    },
    getHeight () {
      // var tabHeight = 0
      // if (this.includeTab) { tabHeight = -20 }
      var heightDif = this.windowHeight - 210
      return heightDif
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
  border: 1px solid #626262 !important;
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
.dashboardTab{
  margin-right: 395px;
  margin-top: -55px;
  margin-bottom: 23px;
}
@media (max-width: 978px) {
  .dashboardTab{
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
