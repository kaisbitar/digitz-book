<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          {{
            analysisType === "exact"
              ? "تحليل الثنائيات الحرفية المتساوية"
              : analysisType === "duality"
              ? "تحليل الثنائيات الحرفية المتتابعة"
              : analysisType === "nineteen"
              ? "تحليل القسمة على 19"
              : "تحليل القسمة على الأعداد"
          }}
        </div>
        <div class="d-flex align-center">
          <v-btn-toggle v-model="analysisType" mandatory class="me-2">
            <v-btn value="exact" size="small"> متساوية </v-btn>
            <v-btn value="duality" size="small"> متتابعة </v-btn>
            <v-btn value="nineteen" size="small"> 19 </v-btn>
            <v-btn value="divisibility" size="small"> الأعداد </v-btn>
          </v-btn-toggle>
        </div>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="getHeaders"
          :items="tableData"
          hover
          class="elevation-1"
          :height="600"
        >
          <!-- ... existing item template ... -->
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import {
  analyzeQuranDuality,
  analyzeExactSequences,
  analyzeGoldenRatio,
  analyzeNumberDivisibility,
} from "@/utils/dualityUtils"

// ... existing imports and setup ...

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

  if (
    analysisType.value === "nineteen" ||
    analysisType.value === "divisibility"
  ) {
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

// Update watch handler
watch(analysisType, async (newType) => {
  const quranFile = dataStore.getOneQuranFile
  if (quranFile) {
    analyzedVerses.value =
      newType === "exact"
        ? analyzeExactSequences(quranFile)
        : newType === "duality"
        ? analyzeQuranDuality(quranFile)
        : newType === "nineteen"
        ? analyzeGoldenRatio(quranFile)
        : analyzeNumberDivisibility(quranFile)
    console.log("Analyzed Verses:", analyzedVerses.value)
  }
})

// Update tableData computed
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
</script>
