<template>
  <label>
    <v-row class="dashboardTab">
      <dashboardTab
        v-for="(item, index) in tabs"
        :key="index"
        :title="item.title"
        :value="item.value"
        :active="activeEl === item.name"
        @selected="activate(item.name)"
      />
    </v-row>
    <v-row>
      <div class="chartRow" v-if="activeEl === 'frequency'">
        <v-row>
          <v-radio-group class="d-flex chartTitleWrap" v-model="view" row
            >تواتر
            <v-radio value="words" label="كلمات"  color="blue"></v-radio>
            <v-radio value="letters" label="حروف"  color="blue"></v-radio>
          </v-radio-group>
        </v-row>
        <chart
          :isLoading="isLoading"
          :series="view === 'letters' ? letterSeries : wordsSeries"
          :options="options"
        />
      </div>
      <dashbordDetailWords
        class="chartRow"
        v-if="activeEl === 'numberOfWords'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :indexes="wordIndexes"
        :occurrences="wordOccurrences"
        :isLoading="isLoading"
      />
      <dashbordDetailLetters
        class="chartRow"
        v-if="activeEl === 'numberOfLetters'"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :indexes="letterIndexes"
        :occurrences="letterOccurrences"
        :isLoading="isLoading"
      />
       <dashbordDetailVerses
        class="chartRow"
        v-if="activeEl === 'numberOfVerses'"
        :versesMap="versesMap"
        :isLoading="isLoading"
      />
    </v-row>
  </label>
</template>

<script>
import chart from '../components/chart.vue'
import dashbordDetailLetters from './dashbordDetailLetters.vue'
import dashbordDetailWords from './dashbordDetailWords.vue'
import dashbordDetailVerses from './dashbordDetailVerses.vue'
import chartOptions from '../assets/suraDashbordChartOptions.js'
import dashboardTab from './dashboardTab'

export default {
  name: 'dashbord',
  components: { chart, dashbordDetailLetters, dashboardTab, dashbordDetailWords, dashbordDetailVerses },
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
    'versesMap'
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
