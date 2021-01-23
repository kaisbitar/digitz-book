<template>
  <div>
    <v-card :style="getheight()" outlined>
      <apexchart
        v-on:markerClick="handleClick"
        :options="options"
        :height="getheight()"
        :series="series"
        ref="myChart"
      />
      <v-overlay
        :absolute="true"
        :opacity="0.6"
        color="white"
        :value="isLoading"
      >
        <v-progress-circular color="indigo" indeterminate></v-progress-circular>
      </v-overlay>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'Chart',
  props: ['options', 'series', 'seriesLable', 'isLoading', 'view'],
  components: { apexchart: VueApexCharts },
  data: () => ({
    windowHeight: window.innerHeight
  }),
  methods: {
    handleClick (seriesIndex, dataPointIndex, chartContext) {
      var target = {
        fileName: this.fileName,
        verseIndex: chartContext.dataPointIndex + 1
      }
      this.$store.commit('setTarget', target)
    },
    getheight () {
      var heightDif = this.windowHeight - 175
      return heightDif
    }
  },
  computed: {
    targetedVerse () {
      return this.$store.getters.target.verseIndex
    }
  },
  watch: {
    windowHeight () {
      this.getheight()
    },
    targetedVerse () {}
  },
  created () {
  },
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
  font-family: '"Roboto", sans-serif !important';
}
.apexcharts-tooltip-text-label {
  margin-right: 6px;
  margin-left: 9px;
}
.apexcharts-tooltip-marker {
  margin-right: -5px;
}
</style>
