<template>
  <div>
    <apexchart
      :markerClick="handleClick"
      :options="options"
      :height="height"
      :series="series"
      ref="myChart"
    />
    <v-overlay :absolute="true" :opacity="0.6" color="white" :value="isLoading">
      <v-progress-circular color="indigo" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
export default {
  name: 'appChart',
  props: ['height', 'options', 'series', 'isLoading', 'includeTab'],
  components: { apexchart: VueApexCharts },
  data: () => ({
    windowHeight: window.innerHeight
  }),
  methods: {
    handleClick (seriesIndex, dataPointIndex, chartContext) {
      this.$store.commit('setTarget', {
        fileName: this.fileName,
        verseIndex: chartContext.dataPointIndex + 1
      })
    }
  },
  computed: {
    targetedVerse () {
      return this.$store.getters.target.verseIndex
    }
  },
  watch: {},
  created () {},
  updated () {},
  mounted () {}
}
</script>

<style >
.apexcharts-toolbar {
  z-index: 1 !important;
}
.apexcharts-tooltip {
  direction: rtl;
}
.apexcharts-tooltip-text-label {
  margin-right: 6px;
  margin-left: 9px;
}
.apexcharts-tooltip-marker {
  margin-right: -5px;
}
.apexcharts-tooltip {
  background: none !important;
  color: rgb(31, 31, 31);
  font-family: "Tajawal", sans-serif;
  font-size: 19px !important;
  white-space: normal !important;
  max-width: 300px;
  background: #ffffff !important;
  border-top: 15px solid #efebe9 !important;
  box-shadow: -1px 1px 10px 0px #ccc;
}
.tipInfo2 {
  border-top: 3px solid #4db6ac !important;
}
.tipInfo {
  border: 1px solid rgb(218, 218, 218);
  border-top: 3px solid #2195f3;
  border-radius: 3px;
  margin: 4px;
  padding: 3px;
  height: fit-content;
}
.tipLabel {
  font-size: 12px;
}
.tipText {
  border-top: 1px solid rgb(218, 218, 218);
  border-right: 3px solid #cfcfcf;
}
</style>
