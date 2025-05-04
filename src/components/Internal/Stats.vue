<template>
  <v-container max-width="1200" class="px-sm-4 px-2 stats-container">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>إحصائيات القرآن الكريم</span>
            <v-btn
              color="primary"
              @click="downloadStats"
              :loading="isDownloading"
            >
              <v-icon start>mdi-download</v-icon>
              تحميل الإحصائيات
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="3"
                v-for="stat in generalStats"
                :key="stat.title"
              >
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h6">{{ stat.value }}</div>
                    <div>{{ stat.title }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>الكلمات المميزة في القرآن</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="wordTableHeaders"
              :items="distinctWords"
              :loading="isLoading"
              :search="search"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  label="بحث"
                  prepend-inner-icon="mdi-magnify"
                  class="mx-4"
                ></v-text-field>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { countDistinctWords } from "@/utils/wordFilter"

const dataStore = useDataStore()
const search = ref("")
const isLoading = ref(false)
const isDownloading = ref(false)

const distinctWords = ref<{ word: string; count: number }[]>([])
const wordTableHeaders = [
  { title: "الكلمة", key: "word", sortable: true },
  { title: "عدد التكرار", key: "count", sortable: true },
]

const generalStats = computed(() => {
  const quranFile = dataStore.oneQuranFile
  if (!quranFile) return []

  const totalVerses = quranFile.length
  const totalWords = quranFile.reduce(
    (acc, verse) => acc + verse.verseText.split(/\s+/).length,
    0
  )
  const totalLetters = quranFile.reduce(
    (acc, verse) => acc + verse.verseText.replace(/\s+/g, "").length,
    0
  )
  const uniqueWords = distinctWords.value.length

  return [
    { title: "عدد الآيات", value: totalVerses },
    { title: "عدد الكلمات", value: totalWords },
    { title: "عدد الحروف", value: totalLetters },
    { title: "عدد الكلمات المميزة", value: uniqueWords },
  ]
})

const processDistinctWords = () => {
  const quranFile = dataStore.oneQuranFile
  if (!quranFile) return

  const wordCounts: { [key: string]: number } = {}

  quranFile.forEach((verse) => {
    const words = verse.verseText.split(/\s+/)
    words.forEach((word) => {
      const cleanWord = word.replace(/[\u064B-\u0652\u0670]/g, "")
      wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1
    })
  })

  distinctWords.value = Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
}

const downloadStats = async () => {
  isDownloading.value = true
  try {
    const stats = {
      //   generalStats: generalStats.value,
      distinctWords: distinctWords.value,
    }

    const blob = new Blob([JSON.stringify(stats, null, 2)], {
      type: "application/json",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "quran-stats.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading stats:", error)
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await processDistinctWords()
  } catch (error) {
    console.error("Error loading stats:", error)
  } finally {
    isLoading.value = false
  }
})
</script>
<style scoped>
.stats-container {
  height: calc(100vh - 60px);
  overflow: auto;
}
</style>
