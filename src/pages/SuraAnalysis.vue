<template>
  <v-container class="sura-analysis-page py-4 pb-16" fluid>
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1
              class="text-h4 font-weight-bold mb-2"
              style="font-family: 'Almarai', sans-serif"
            >
              تحليل سورة {{ suraName }}
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              التحليل العددي الكامل للسورة
            </p>
          </div>

          <!-- Loading State -->
          <v-card v-if="isLoading" class="mb-6" elevation="2" rounded="lg">
            <v-card-text class="pa-6 text-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              />
              <p class="mt-4">جاري تحميل البيانات...</p>
            </v-card-text>
          </v-card>

          <template v-else>
            <!-- Sura Overview Stats -->
            <v-row class="mb-6">
              <v-col cols="6" sm="3">
                <v-card variant="tonal" color="primary" rounded="lg">
                  <v-card-text class="text-center pa-4">
                    <div class="text-h4 font-weight-bold">{{ suraNumber }}</div>
                    <div class="text-caption">رقم السورة</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card variant="tonal" color="secondary" rounded="lg">
                  <v-card-text class="text-center pa-4">
                    <div class="text-h4 font-weight-bold">
                      {{ suraVerses.length }}
                    </div>
                    <div class="text-caption">عدد الآيات</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card variant="tonal" color="success" rounded="lg">
                  <v-card-text class="text-center pa-4">
                    <div class="text-h4 font-weight-bold">
                      {{ totalWords }}
                    </div>
                    <div class="text-caption">عدد الكلمات</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card variant="tonal" color="warning" rounded="lg">
                  <v-card-text class="text-center pa-4">
                    <div class="text-h4 font-weight-bold">
                      {{ totalLetters }}
                    </div>
                    <div class="text-caption">عدد الحروف</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Total Sura Value -->
            <v-card class="mb-6" elevation="2" rounded="lg">
              <v-card-text class="pa-6">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-overline text-medium-emphasis">
                      القيمة العددية الإجمالية للسورة
                    </div>
                    <div class="text-h3 font-weight-bold text-primary">
                      {{ totalSuraValue }}
                    </div>
                  </div>
                  <v-icon size="64" color="primary" class="opacity-30">
                    mdi-sigma
                  </v-icon>
                </div>
              </v-card-text>
            </v-card>

            <!-- Tabs for different views -->
            <v-tabs v-model="activeTab" centered color="primary" class="mb-4">
              <v-tab value="verses">
                <v-icon start>mdi-format-list-numbered</v-icon>
                الآيات
              </v-tab>
              <v-tab value="words">
                <v-icon start>mdi-alphabetical</v-icon>
                الكلمات
              </v-tab>
              <v-tab value="letters">
                <v-icon start>mdi-alpha-a-box</v-icon>
                الحروف
              </v-tab>
              <v-tab value="matching">
                <v-icon start>mdi-equal</v-icon>
                المتساويات
              </v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- Verses Tab -->
              <v-window-item value="verses">
                <v-card elevation="2" rounded="lg">
                  <v-card-title class="pa-4">
                    <v-icon start color="primary">mdi-format-list-numbered</v-icon>
                    تحليل الآيات
                  </v-card-title>
                  <v-divider />
                  <v-data-table
                    :headers="verseHeaders"
                    :items="versesAnalysis"
                    :items-per-page="-1"
                    hide-default-footer
                    hover
                    class="sura-analysis-table"
                  >
                    <template v-slot:item.verseIndex="{ item }">
                      <v-chip color="primary" variant="flat" size="small">
                        {{ item.verseIndex }}
                      </v-chip>
                    </template>
                    <template v-slot:item.verseText="{ item }">
                      <div class="text-body-1 py-2" dir="rtl">
                        {{ item.verseText }}
                      </div>
                    </template>
                    <template v-slot:item.value="{ item }">
                      <v-chip color="success" variant="tonal" size="large">
                        <span class="font-weight-bold">{{ item.value }}</span>
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>

              <!-- Words Tab -->
              <v-window-item value="words">
                <v-card elevation="2" rounded="lg">
                  <v-card-title class="d-flex align-center pa-4">
                    <v-icon start color="primary">mdi-alphabetical</v-icon>
                    تحليل الكلمات
                    <v-spacer />
                    <v-text-field
                      v-model="wordSearch"
                      prepend-inner-icon="mdi-magnify"
                      label="ابحث عن كلمة..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      style="max-width: 300px"
                      dir="rtl"
                    />
                  </v-card-title>
                  <v-divider />
                  <v-data-table
                    :headers="wordHeaders"
                    :items="filteredWordsAnalysis"
                    :items-per-page="20"
                    :height="500"
                    fixed-header
                    hover
                    class="sura-analysis-table"
                  >
                    <template v-slot:item.verseIndex="{ item }">
                      <v-chip color="primary" variant="outlined" size="x-small">
                        {{ item.verseIndex }}
                      </v-chip>
                    </template>
                    <template v-slot:item.word="{ item }">
                      <span class="text-h6">{{ item.word }}</span>
                    </template>
                    <template v-slot:item.value="{ item }">
                      <v-chip color="success" variant="tonal">
                        {{ item.value }}
                      </v-chip>
                    </template>
                    <template v-slot:item.letterCount="{ item }">
                      {{ item.letterCount }}
                    </template>
                  </v-data-table>
                </v-card>
              </v-window-item>

              <!-- Letters Tab -->
              <v-window-item value="letters">
                <v-card elevation="2" rounded="lg">
                  <v-card-title class="pa-4">
                    <v-icon start color="primary">mdi-alpha-a-box</v-icon>
                    تحليل الحروف
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-4">
                    <v-row>
                      <v-col
                        v-for="(item, index) in lettersAnalysis"
                        :key="index"
                        cols="6"
                        sm="4"
                        md="3"
                        lg="2"
                      >
                        <v-card variant="outlined" rounded="lg" class="pa-3">
                          <div class="text-center">
                            <div class="text-h3 text-primary mb-2">
                              {{ item.letter }}
                            </div>
                            <v-divider class="mb-2" />
                            <div class="d-flex justify-space-between text-caption">
                              <span>القيمة:</span>
                              <span class="font-weight-bold">{{ item.value }}</span>
                            </div>
                            <div class="d-flex justify-space-between text-caption">
                              <span>التكرار:</span>
                              <span class="font-weight-bold">{{ item.count }}</span>
                            </div>
                            <v-divider class="my-2" />
                            <div class="d-flex justify-space-between">
                              <span class="text-caption">المجموع:</span>
                              <v-chip color="primary" variant="flat" size="x-small">
                                {{ item.total }}
                              </v-chip>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <!-- Matching Values Tab -->
              <v-window-item value="matching">
                <v-card elevation="2" rounded="lg">
                  <v-card-title class="pa-4">
                    <v-icon start color="primary">mdi-equal</v-icon>
                    الكلمات والآيات المتساوية في القيمة
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-4">
                    <template v-if="matchingValues.length > 0">
                      <v-expansion-panels variant="accordion">
                        <v-expansion-panel
                          v-for="(group, index) in matchingValues"
                          :key="index"
                        >
                          <v-expansion-panel-title>
                            <div class="d-flex align-center gap-3">
                              <v-chip color="primary" variant="flat">
                                القيمة: {{ group.value }}
                              </v-chip>
                              <span class="text-body-2">
                                {{ group.items.length }} عناصر متساوية
                              </span>
                            </div>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-list density="compact">
                              <v-list-item
                                v-for="(item, idx) in group.items"
                                :key="idx"
                              >
                                <template v-slot:prepend>
                                  <v-chip
                                    :color="item.type === 'verse' ? 'secondary' : 'success'"
                                    variant="tonal"
                                    size="x-small"
                                    class="ml-2"
                                  >
                                    {{ item.type === 'verse' ? 'آية' : 'كلمة' }}
                                  </v-chip>
                                </template>
                                <v-list-item-title>
                                  {{ item.text }}
                                </v-list-item-title>
                                <v-list-item-subtitle v-if="item.verseIndex">
                                  آية {{ item.verseIndex }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </template>
                    <template v-else>
                      <div class="text-center pa-8 text-medium-emphasis">
                        <v-icon size="64" class="mb-4">mdi-information-outline</v-icon>
                        <p>لا توجد عناصر متساوية في القيمة</p>
                      </div>
                    </template>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>

            <!-- Summary Card -->
            <v-card class="mt-6" elevation="2" rounded="lg">
              <v-card-title class="pa-4">
                <v-icon start color="primary">mdi-chart-box</v-icon>
                ملخص القيم
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th colspan="2" class="text-center text-primary">
                            قيم الآيات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="verse in versesAnalysis"
                          :key="verse.verseIndex"
                        >
                          <td>آية {{ verse.verseIndex }}</td>
                          <td class="text-left font-weight-bold">
                            {{ verse.value }}
                          </td>
                        </tr>
                        <tr class="bg-primary-lighten-5">
                          <td class="font-weight-bold">المجموع</td>
                          <td class="text-left font-weight-bold text-primary">
                            {{ totalSuraValue }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th colspan="2" class="text-center text-primary">
                            إحصائيات عامة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>عدد الكلمات الفريدة</td>
                          <td class="text-left font-weight-bold">
                            {{ uniqueWordsCount }}
                          </td>
                        </tr>
                        <tr>
                          <td>أعلى قيمة كلمة</td>
                          <td class="text-left font-weight-bold">
                            {{ highestWordValue?.word }} ({{ highestWordValue?.value }})
                          </td>
                        </tr>
                        <tr>
                          <td>أدنى قيمة كلمة</td>
                          <td class="text-left font-weight-bold">
                            {{ lowestWordValue?.word }} ({{ lowestWordValue?.value }})
                          </td>
                        </tr>
                        <tr>
                          <td>متوسط قيمة الكلمة</td>
                          <td class="text-left font-weight-bold">
                            {{ averageWordValue }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useDataStore } from "@/stores/dataStore"
import { calculateValue } from "@/mixins/counting"

const route = useRoute()
const dataStore = useDataStore()

// State
const isLoading = ref(true)
const activeTab = ref("verses")
const wordSearch = ref("")
const suraVerses = ref([])
const suraName = ref("")
const suraNumber = ref(113) // Default to Al-Falaq

// Letter values map
const letterValues = {
  ا: 1,
  ل: 2,
  ن: 3,
  م: 4,
  و: 5,
  ي: 6,
  ه: 7,
  ر: 8,
  ب: 9,
  ت: 10,
  ك: 11,
  ع: 12,
  ف: 13,
  ق: 14,
  س: 15,
  د: 16,
  ذ: 17,
  ح: 18,
  ج: 19,
  خ: 20,
  ش: 21,
  ص: 22,
  ض: 23,
  ز: 24,
  ث: 25,
  ط: 26,
  غ: 27,
  ظ: 28,
}

const calculationVariations = {
  أ: "ا",
  إ: "ا",
  آ: "ا",
  ء: "ا",
  ؤ: "و",
  ى: "ي",
  ئ: "ي",
  ة: "ه",
}

const getBaseChar = (char) => calculationVariations[char] || char

// Table headers
const verseHeaders = [
  { title: "رقم الآية", key: "verseIndex", width: "100px", align: "center" },
  { title: "نص الآية", key: "verseText", sortable: false },
  { title: "الكلمات", key: "wordCount", width: "100px", align: "center" },
  { title: "الحروف", key: "letterCount", width: "100px", align: "center" },
  { title: "القيمة", key: "value", width: "120px", align: "center" },
]

const wordHeaders = [
  { title: "الآية", key: "verseIndex", width: "80px", align: "center" },
  { title: "الكلمة", key: "word", width: "150px" },
  { title: "الحروف", key: "letterCount", width: "80px", align: "center" },
  { title: "القيمة", key: "value", width: "100px", align: "center" },
  { title: "الموقع", key: "position", width: "80px", align: "center" },
]

// Computed properties
const totalWords = computed(() =>
  suraVerses.value.reduce(
    (sum, v) => sum + v.verseText.split(/\s+/).filter(Boolean).length,
    0
  )
)

const totalLetters = computed(() =>
  suraVerses.value.reduce((sum, v) => {
    const clean = v.verseText.replace(
      /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED\s]/g,
      ""
    )
    return sum + clean.length
  }, 0)
)

const totalSuraValue = computed(() =>
  versesAnalysis.value.reduce((sum, v) => sum + v.value, 0)
)

const versesAnalysis = computed(() =>
  suraVerses.value.map((verse) => {
    const cleanText = verse.verseText.replace(
      /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
      ""
    )
    return {
      verseIndex: verse.verseIndex,
      verseText: verse.verseText,
      wordCount: verse.verseText.split(/\s+/).filter(Boolean).length,
      letterCount: cleanText.replace(/\s/g, "").length,
      value: calculateValue(verse.verseText),
    }
  })
)

const wordsAnalysis = computed(() => {
  const words = []
  suraVerses.value.forEach((verse) => {
    const cleanText = verse.verseText.replace(
      /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
      ""
    )
    const verseWords = cleanText.split(/\s+/).filter(Boolean)
    verseWords.forEach((word, idx) => {
      words.push({
        verseIndex: verse.verseIndex,
        word: word,
        letterCount: word.length,
        value: calculateValue(word),
        position: idx + 1,
      })
    })
  })
  return words
})

const filteredWordsAnalysis = computed(() => {
  if (!wordSearch.value) return wordsAnalysis.value
  return wordsAnalysis.value.filter((w) => w.word.includes(wordSearch.value))
})

const lettersAnalysis = computed(() => {
  const letterCounts = {}

  suraVerses.value.forEach((verse) => {
    const cleanText = verse.verseText.replace(
      /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED\s]/g,
      ""
    )
    for (const char of cleanText) {
      const baseChar = getBaseChar(char)
      if (letterValues[baseChar]) {
        if (!letterCounts[baseChar]) {
          letterCounts[baseChar] = {
            letter: baseChar,
            value: letterValues[baseChar],
            count: 0,
          }
        }
        letterCounts[baseChar].count++
      }
    }
  })

  return Object.values(letterCounts)
    .map((item) => ({
      ...item,
      total: item.value * item.count,
    }))
    .sort((a, b) => b.count - a.count)
})

const matchingValues = computed(() => {
  const valueMap = {}

  // Add verses
  versesAnalysis.value.forEach((verse) => {
    if (!valueMap[verse.value]) {
      valueMap[verse.value] = []
    }
    valueMap[verse.value].push({
      type: "verse",
      text: verse.verseText,
      verseIndex: verse.verseIndex,
    })
  })

  // Add words
  wordsAnalysis.value.forEach((word) => {
    if (!valueMap[word.value]) {
      valueMap[word.value] = []
    }
    valueMap[word.value].push({
      type: "word",
      text: word.word,
      verseIndex: word.verseIndex,
    })
  })

  // Filter to only groups with more than 1 item
  return Object.entries(valueMap)
    .filter(([_, items]) => items.length > 1)
    .map(([value, items]) => ({
      value: parseInt(value),
      items: items,
    }))
    .sort((a, b) => b.items.length - a.items.length)
})

const uniqueWordsCount = computed(() => {
  const unique = new Set(wordsAnalysis.value.map((w) => w.word))
  return unique.size
})

const highestWordValue = computed(() => {
  if (!wordsAnalysis.value.length) return null
  return wordsAnalysis.value.reduce((max, w) =>
    w.value > max.value ? w : max
  )
})

const lowestWordValue = computed(() => {
  if (!wordsAnalysis.value.length) return null
  return wordsAnalysis.value.reduce((min, w) =>
    w.value < min.value ? w : min
  )
})

const averageWordValue = computed(() => {
  if (!wordsAnalysis.value.length) return 0
  const sum = wordsAnalysis.value.reduce((s, w) => s + w.value, 0)
  return Math.round(sum / wordsAnalysis.value.length)
})

// Methods
const loadSuraData = async () => {
  isLoading.value = true

  await dataStore.getQuranData()

  const quranIndex = dataStore.QuranIndex
  const allVerses = dataStore.oneQuranFile

  if (!quranIndex?.length || !allVerses?.length) {
    isLoading.value = false
    return
  }

  // Get sura number from route or default to 113 (Al-Falaq)
  const suraNum = parseInt(route.params.suraNumber) || 113
  suraNumber.value = suraNum

  // Find sura info
  const suraInfo = quranIndex[suraNum]
  if (!suraInfo) {
    isLoading.value = false
    return
  }

  suraName.value = suraInfo.fileName.replace(/[0-9]/g, "")

  // Get verses for this sura
  const startIndex = suraInfo.verseNumberToQuran - 1
  const endIndex = startIndex + suraInfo.numberOfVerses

  suraVerses.value = allVerses.slice(startIndex, endIndex)

  isLoading.value = false
}

// Watch for route changes
watch(
  () => route.params.suraNumber,
  () => {
    loadSuraData()
  }
)

onMounted(() => {
  loadSuraData()
})
</script>

<style>
.sura-analysis-page {
  height: calc(100vh - 64px);
  overflow-y: auto !important;
  overflow-x: hidden;
}

.sura-analysis-table .v-data-table__td {
  font-family: "Almarai", sans-serif;
}

.bg-primary-lighten-5 {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>

