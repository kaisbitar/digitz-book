<template>
  <div>
    <div class="d-flex">
      <suraTextInfoBasic class="mr-1 ml-2" />
      <v-row class="numbersBlock mb-2 mr-2 mt-n1">
        <v-card
          class="suraInfoSingleBox"
          @click="activate(1)"
          :class="{ active: active_el == 1 }"
          outlined
        >
          <div class="d-flex ma-auto">
            <span class="ml-1 body-1">
              {{ numberOfVerses }}
            </span>
            آية
          </div></v-card
        >
        <v-card
          class="suraInfoSingleBox"
          @click="activate(2)"
          :class="{ active: active_el == 2 }"
          outlined
        >
          <div class="d-flex ma-auto">
            <span class="ml-1 body-1">
              {{ numberOfWords }}
            </span>
            كلمة
          </div></v-card
        >
        <v-card
          class="suraInfoSingleBox"
          @click="activate(3)"
          :class="{ active: active_el == 3 }"
          outlined
        >
          <div class="d-flex ma-auto">
            <span class="ml-1 body-1">
              {{ numberOfLetters }}
            </span>
            حرف
          </div>
        </v-card>
        <v-card
          class="suraInfoSingleBox"
          @click="activate(4)"
          :class="{ active: active_el == 4 }"
          outlined
        >
          <div class="d-flex ma-auto">تواتر</div>
        </v-card>
      </v-row>
    </div>
    <v-row>
      <div class="chartRow" v-if="active_el === 4">
        <v-row>
          <v-radio-group class="d-flex chartTitleWrap" v-model="view" row
            >تواتر
            <v-radio label="كلمات" color="blue" value="words"></v-radio>
            <v-radio
              value="letters"
              label="حروف"
              color="blue"
            ></v-radio> </v-radio-group
        ></v-row>
        <chart
          class="mr-1 pa-0 ml-2"
          :dataType="'letters'"
          :height="getheight()"
          :isLoading="isLoading"
          :series="series"
          :view="view"
          :options="options"
        />
      </div>
      <suraDashboardDetails
        class="chartRow"
        v-if="active_el === 3 || active_el === 2"
        :selectedDataType="selectedDataType"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
      />
    </v-row>
  </div>
</template>

<script>
import chart from '../components/chart.vue'
import suraTextInfoBasic from '../components/suraTextInfoBasic'
import suraDashboardDetails from './suraDashboardDetails.vue'
import chartOptions from '../assets/suraDashbordChartOptions.js'

export default {
  name: 'suraDashbord',
  components: { chart, suraTextInfoBasic, suraDashboardDetails },
  props: ['numberOfVerses', 'numberOfWords', 'numberOfLetters'],
  data: () => ({
    show: true,
    chartData: {},
    isLoading: true,
    active_el: 4,
    selectedDataType: 'words',
    series: [],
    view: 'words',
    options: chartOptions
  }),
  methods: {
    fetchSuraChartData () {
      this.isLoading = true
      setTimeout(() => {
        this.$store
          .dispatch('getSuraChartData')
          .then((items) => {
            if (this.view === 'letters') {
              var series = [{ data: items.letters }]
              this.series = series
              return
            }
            series = [{ data: items.words }]
            this.series = series
          })
          .then((items) => {
            this.isLoading = false
          })
      }, 100)
    },
    activate: function (el) {
      this.active_el = el
      if (this.active_el === 3) {
        this.selectedDataType = 'letters'
        return
      }
      this.selectedDataType = 'words'
    },
    getheight () {
      var heightDif = this.windowHeight - 175
      return heightDif
    }
  },
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  watch: {
    fileName () {
      this.fetchSuraChartData()
    },
    view () {
      this.fetchSuraChartData()
    }
  },
  created () {
    this.fetchSuraChartData()
  },
  mounted () {
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
  opacity: .5;
}
.suraInfoSingleBox.active{
  opacity: 1;
  border: 1px solid #626262 !important;
}
.chartRow {
  width: -webkit-fill-available;
}
.theme--light.v-card {
}
.chartTitleWrap {
  zoom: 0.8;
  position: absolute;
  z-index: 3;
  margin-top: 3px !important;
  margin-right: 250px;
}
</style>
