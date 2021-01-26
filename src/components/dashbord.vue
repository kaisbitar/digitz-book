<template>
  <label>
    <div class="d-flex">
      <v-row class="numbersBlock mb-2 mr-2 mt-n1">
        <dashboardTab
          v-for="(item, index) in tabs"
          :key="index"
          :title="item.title"
          :value="item.value"
          :active="activeEl === item.name"
          @selected="activate(item.name)"
        />
      </v-row>
    </div>
    <v-row>
      <div class="chartRow" v-if="activeEl === 'frequency'">
        <v-row>
          <v-radio-group class="d-flex chartTitleWrap" v-model="view" row
            >تواتر
            <v-radio label="كلمات" color="blue" value="words"></v-radio>
            <v-radio value="letters" label="حروف" color="blue"></v-radio>
          </v-radio-group>
        </v-row>
        <chart
          :dataType="'letters'"
          :height="getHeight()"
          :isLoading="isLoading"
          :series="view === 'letters' ? letterSeries : wordsSeries"
          :view="view"
          :options="options"
        />
      </div>
      <dashboardDetails
        class="chartRow"
        v-if="activeEl === 'numberOfWords'"
        :dataType="'الكلمة'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :detailsData="wordIndexes"
        :tableData="wordOccurrences"
        :groupBy="'y'"
        :hasChart="false"
        :isLoading="isLoading"
      />
      <dashboardDetails
        class="chartRow"
        v-if="activeEl === 'numberOfLetters'"
        :dataType="'الحرف'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :detailsData="letterIndexes"
        :tableData="letterOccurrences"
        :series="countSeries"
        :groupBy="null"
        :hasChart="true"
        :isLoading="isLoading"
      />
    </v-row>
  </label>
</template>

<script>
import chart from '../components/chart.vue'
import dashboardDetails from './dashboardDetails.vue'
import chartOptions from '../assets/suraDashbordChartOptions.js'
import dashboardTab from './dashboardTab'

export default {
  name: 'suraDashbord',
  components: { chart, dashboardDetails, dashboardTab },
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
    'wordsSeries'
  ],
  data: () => ({
    activeEl: 'frequency',
    dataType: 'الكلمة',
    view: 'words',
    options: chartOptions,
    windowHeight: window.innerHeight
  }),
  methods: {
    activate (el) {
      this.activeEl = el
      this.$emit('tabChanged', el)
    },
    getHeight () {
      var heightDif = this.windowHeight - 175
      return heightDif
    }
  },
  computed: {
    countSeries () {
      if (!this.letterOccurrences) return [{ data: [] }]
      return [{ data: this.letterOccurrences }]
    },
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
  width: 169.5px;
  display: flex;
  color: #fff;
  opacity: 0.5;
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
</style>
