<template>
  <v-container>
    <v-card>
      <AnalysisHeader
        :analysis-type="analysisType"
        @update:type="analysisType = $event"
      />

      <v-card-text>
        <v-data-table
          :headers="getHeaders"
          :items="tableData"
          hover
          class="elevation-1"
          :height="560"
        >
          <template v-slot:item.verseText="{ item }">
            <VerseTextDisplay :item="item" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useDataStore } from "@/stores/dataStore"
import {
  analyzeDuality,
  analyzeExactSequences,
  analyzeGoldenRatio,
  analyzeNumberDivisibility,
} from "@/utils/dualityUtils"

// Core state
const dataStore = useDataStore()
const analyzedVerses = ref([])
const analysisType = ref("exact")

// Computed properties
const showDivisibilityColumns = computed(() =>
  ["nineteen", "divisibility"].includes(analysisType.value)
)

const getHeaders = computed(() => {
  const baseHeaders = [
    {
      title: "رقم الآية",
      align: "center",
      key: "verseIndex",
      sortable: true,
      width: "100px",
    },
    {
      title: "النص",
      align: "start",
      key: "verseText",
      sortable: false,
    },
  ]

  if (showDivisibilityColumns.value) {
    baseHeaders.push(
      {
        title: "مجموع الحروف",
        align: "center",
        key: "totalCount",
        sortable: true,
      },
      {
        title: analysisType.value === "nineteen" ? "عامل 19" : "القواسم",
        align: "center",
        key: analysisType.value === "nineteen" ? "factor19" : "divisor",
        sortable: true,
      }
    )
  }

  return baseHeaders
})

const tableData = computed(() => {
  if (!analyzedVerses.value?.length) return []

  return analyzedVerses.value
    .filter((verse) => verse.patterns?.length > 0)
    .flatMap((verse) =>
      verse.patterns.map((pattern) => ({
        verseIndex: verse.verseIndex,
        words: verse.verseText.split(" "),
        firstIndices: pattern.firstIndices,
        secondIndices: pattern.secondIndices,
        firstLetterCount: pattern.firstLetterCount,
        secondLetterCount: pattern.secondLetterCount,
        difference: pattern.difference,
        totalCount: pattern.totalCount,
        factor19: pattern.factor19,
        divisor: pattern.divisor,
        factor: pattern.factor,
      }))
    )
})

// Watchers and lifecycle hooks
watch(analysisType, async (newType) => {
  const quranFile = dataStore.getOneQuranFile
  if (!quranFile) return

  const analysisMap = {
    exact: analyzeExactSequences,
    duality: analyzeDuality,
    nineteen: analyzeGoldenRatio,
    divisibility: analyzeNumberDivisibility,
  }

  analyzedVerses.value = analysisMap[newType](quranFile)
})

onMounted(async () => {
  try {
    await dataStore.getQuranData()
    const quranFile = dataStore.getOneQuranFile
    if (quranFile) {
      analyzedVerses.value = analyzeExactSequences(quranFile)
    }
  } catch (error) {
    console.error("Error loading data:", error)
  }
})
</script>
