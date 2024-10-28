<template>
  <Chart :options="chartOptions" :series="localSeries" />
</template>

<script setup>
import Chart from "./Chart.vue"
import { computed } from "vue"

const props = defineProps({
  series: {
    type: Object,
    required: true,
  },
})

const localSeries = computed(() => {
  if (!props.series?.verses?.length) {
    console.log("No verses found in series:", props.series)
    return []
  }

  return props.series.verses.map((verse) => {
    const words = verse.verseText.split(" ")

    // Create a sequence where each position represents a word
    const wordPositions = words.map((word, index) => {
      const normalizedWord = word
        .replace(/[\u064B-\u065F]/g, "")
        .replace(/أ/g, "ا")

      return {
        x: index + 1, // Position in text (1-based)
        y: verse.fileName,
        value: normalizedWord === "الارض" ? 2 : 1, // Using 2 for matches, 1 for regular words
      }
    })

    return {
      name: verse.fileName,
      data: wordPositions,
    }
  })
})

const chartOptions = {
  chart: {
    type: "heatmap",
    toolbar: {
      show: false,
    },
    height: 80,
    background: "#ffffff",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  grid: {
    show: false,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  plotOptions: {
    heatmap: {
      colorScale: {
        ranges: [
          {
            from: 1,
            to: 1,
            color: "#e0e0e0", // Light gray for regular words
            name: "normal",
          },
          {
            from: 2,
            to: 2,
            color: "#1976d2", // Darker blue for matches
            name: "match",
          },
        ],
      },
      radius: 0,
      enableShades: false,
    },
  },
  stroke: {
    width: 1,
    colors: ["#ffffff"], // White borders between cells
  },
}
</script>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
