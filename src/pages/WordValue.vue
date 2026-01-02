<template>
  <v-container class="word-value-page py-4 pb-16" fluid>
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="8">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1
            class="text-h4 font-weight-bold mb-2"
            style="font-family: 'Almarai', sans-serif"
          >
            حساب قيمة الكلمات
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            احسب القيمة العددية للكلمات واستكشف كلمات القرآن
          </p>
        </div>

        <!-- Tabs -->
        <v-tabs v-model="activeTab" centered color="primary" class="mb-6">
          <v-tab value="calculator">
            <v-icon start>mdi-calculator</v-icon>
            حاسبة القيمة
          </v-tab>
          <v-tab value="quran-words">
            <v-icon start>mdi-book-open-variant</v-icon>
            كلمات القرآن
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Calculator Tab -->
          <v-window-item value="calculator">
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <!-- Input Card -->
                <v-card class="mb-6" elevation="2" rounded="lg">
                  <v-card-text class="pa-6">
                    <v-textarea
                      v-model="inputText"
                      label="أدخل النص العربي"
                      placeholder="اكتب كلمة أو جملة..."
                      variant="outlined"
                      rows="3"
                      auto-grow
                      dir="rtl"
                      hide-details
                      class="mb-4"
                      @input="calculateAll"
                    />

                    <div class="d-flex gap-2">
                      <v-btn
                        color="primary"
                        size="large"
                        block
                        @click="calculateAll"
                        :disabled="!inputText.trim()"
                      >
                        <v-icon start>mdi-calculator</v-icon>
                        احسب القيمة
                      </v-btn>
                      <v-btn
                        variant="outlined"
                        size="large"
                        @click="clearInput"
                        :disabled="!inputText"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Results Card -->
                <v-expand-transition>
                  <v-card
                    v-if="totalValue > 0"
                    elevation="2"
                    rounded="lg"
                    class="mb-6"
                  >
                    <v-card-text class="pa-6">
                      <!-- Total Value Display -->
                      <div class="text-center mb-6">
                        <div class="text-overline text-medium-emphasis mb-2">
                          القيمة الإجمالية
                        </div>
                        <div class="text-h2 font-weight-bold text-primary">
                          {{ totalValue }}
                        </div>
                      </div>

                      <v-divider class="mb-6" />

                      <!-- Word Breakdown -->
                      <div v-if="wordBreakdown.length > 1" class="mb-6">
                        <div class="text-subtitle-2 text-medium-emphasis mb-3">
                          تفصيل الكلمات
                        </div>
                        <v-chip-group>
                          <v-chip
                            v-for="(word, index) in wordBreakdown"
                            :key="index"
                            variant="tonal"
                            color="primary"
                            size="large"
                            class="ma-1"
                          >
                            <span class="font-weight-bold ml-2">{{
                              word.text
                            }}</span>
                            <span class="text-medium-emphasis"
                              >= {{ word.value }}</span
                            >
                          </v-chip>
                        </v-chip-group>
                      </div>

                      <!-- Letter Breakdown -->
                      <div>
                        <div class="text-subtitle-2 text-medium-emphasis mb-3">
                          تفصيل الحروف
                        </div>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-right">الحرف</th>
                              <th class="text-center">القيمة</th>
                              <th class="text-center">التكرار</th>
                              <th class="text-left">المجموع</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(letter, index) in letterBreakdown"
                              :key="index"
                            >
                              <td class="text-right text-h6">
                                {{ letter.char }}
                              </td>
                              <td class="text-center">{{ letter.value }}</td>
                              <td class="text-center">{{ letter.count }}</td>
                              <td class="text-left font-weight-bold">
                                {{ letter.total }}
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>

                <!-- Letter Values Reference -->
                <v-expansion-panels variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-icon start>mdi-information-outline</v-icon>
                      جدول قيم الحروف
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row dense>
                        <v-col
                          v-for="(value, letter) in letterValues"
                          :key="letter"
                          cols="4"
                          sm="3"
                          md="2"
                        >
                          <v-card
                            variant="tonal"
                            class="text-center pa-2"
                            rounded="lg"
                          >
                            <div class="text-h5">{{ letter }}</div>
                            <div class="text-caption text-medium-emphasis">
                              {{ value }}
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Quran Words Tab -->
          <v-window-item value="quran-words">
            <!-- Stats Cards -->
            <v-row class="mb-4" v-if="isProcessed">
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="primary" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ totalUniqueWords.toLocaleString() }}
                    </div>
                    <div class="text-caption">كلمات فريدة</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="secondary" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ uniqueValuesCount.toLocaleString() }}
                    </div>
                    <div class="text-caption">قيم عددية مختلفة</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card variant="tonal" color="success" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ matchingValuesCount.toLocaleString() }}
                    </div>
                    <div class="text-caption">قيم متشابهة (أكثر من كلمة)</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Process Button -->
            <v-card v-if="!isProcessed" class="mb-6" elevation="2" rounded="lg">
              <v-card-text class="pa-6 text-center">
                <v-icon size="64" color="primary" class="mb-4"
                  >mdi-database-search</v-icon
                >
                <h3 class="text-h6 mb-2">تحليل كلمات القرآن الكريم</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  سيتم استخراج جميع الكلمات وحساب قيمتها العددية وتجميع الكلمات
                  المتساوية في القيمة
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  :loading="isProcessing"
                  @click="processQuranWords"
                >
                  <v-icon start>mdi-play</v-icon>
                  ابدأ التحليل
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Processing Progress -->
            <v-card v-if="isProcessing" class="mb-6" elevation="2" rounded="lg">
              <v-card-text class="pa-6">
                <div class="text-center mb-4">
                  <v-progress-circular
                    :model-value="processingProgress"
                    :size="80"
                    :width="8"
                    color="primary"
                  >
                    {{ Math.round(processingProgress) }}%
                  </v-progress-circular>
                </div>
                <v-progress-linear
                  :model-value="processingProgress"
                  color="primary"
                  height="8"
                  rounded
                />
                <p class="text-center text-body-2 text-medium-emphasis mt-2">
                  جاري معالجة الآيات...
                </p>
              </v-card-text>
            </v-card>

            <!-- Results Table -->
            <v-card v-if="isProcessed" elevation="2" rounded="lg">
              <v-card-title class="d-flex align-center pa-4">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="ابحث عن كلمة أو قيمة..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  class="flex-grow-1"
                  dir="rtl"
                />
                <v-btn-toggle
                  v-model="viewMode"
                  mandatory
                  density="compact"
                  class="mr-4"
                >
                  <v-btn value="grouped" size="small">
                    <v-icon>mdi-group</v-icon>
                    مجمّع
                  </v-btn>
                  <v-btn value="flat" size="small">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                    قائمة
                  </v-btn>
                </v-btn-toggle>
              </v-card-title>

              <v-divider />

              <!-- Grouped View -->
              <template v-if="viewMode === 'grouped'">
                <v-data-table
                  :headers="groupedHeaders"
                  :items="filteredGroupedData"
                  :items-per-page="20"
                  :height="500"
                  fixed-header
                  hover
                  class="word-value-table"
                >
                  <template v-slot:item.value="{ item }">
                    <v-chip color="primary" variant="flat" size="small">
                      {{ item.value }}
                    </v-chip>
                  </template>
                  <template v-slot:item.words="{ item }">
                    <div class="d-flex flex-wrap gap-1 py-2">
                      <v-chip
                        v-for="(word, idx) in item.words.slice(0, 10)"
                        :key="idx"
                        variant="tonal"
                        size="small"
                        class="ma-1"
                      >
                        {{ word.text }}
                        <span class="text-caption text-medium-emphasis mr-1"
                          >({{ word.count }})</span
                        >
                      </v-chip>
                      <v-chip
                        v-if="item.words.length > 10"
                        variant="outlined"
                        size="small"
                        class="ma-1"
                        @click="showAllWords(item)"
                      >
                        +{{ item.words.length - 10 }} المزيد
                      </v-chip>
                    </div>
                  </template>
                  <template v-slot:item.count="{ item }">
                    <span class="font-weight-bold">{{ item.count }}</span>
                  </template>
                </v-data-table>
              </template>

              <!-- Flat View -->
              <template v-else>
                <v-data-table
                  :headers="flatHeaders"
                  :items="filteredFlatData"
                  :items-per-page="50"
                  :height="500"
                  fixed-header
                  hover
                  class="word-value-table"
                >
                  <template v-slot:item.value="{ item }">
                    <v-chip color="primary" variant="flat" size="small">
                      {{ item.value }}
                    </v-chip>
                  </template>
                  <template v-slot:item.word="{ item }">
                    <span class="text-h6">{{ item.word }}</span>
                  </template>
                  <template v-slot:item.matchingWords="{ item }">
                    <div class="d-flex flex-wrap gap-1">
                      <v-chip
                        v-for="(match, idx) in item.matchingWords.slice(0, 5)"
                        :key="idx"
                        variant="tonal"
                        color="success"
                        size="x-small"
                      >
                        {{ match }}
                      </v-chip>
                      <span
                        v-if="item.matchingWords.length > 5"
                        class="text-caption"
                      >
                        +{{ item.matchingWords.length - 5 }}
                      </span>
                    </div>
                  </template>
                </v-data-table>
              </template>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- Dialog for showing all words -->
    <v-dialog v-model="showWordsDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>كلمات بقيمة {{ selectedValueGroup?.value }}</span>
          <v-spacer />
          <v-btn icon variant="text" @click="showWordsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-chip
            v-for="(word, idx) in selectedValueGroup?.words"
            :key="idx"
            variant="tonal"
            class="ma-1"
          >
            {{ word.text }}
            <span class="text-caption text-medium-emphasis mr-1"
              >({{ word.count }})</span
            >
          </v-chip>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { calculateValue } from "@/mixins/counting"

const dataStore = useDataStore()

// Tab state
const activeTab = ref("calculator")

// Calculator state
const inputText = ref("")
const totalValue = ref(0)
const wordBreakdown = ref([])
const letterBreakdown = ref([])

// Quran words state
const isProcessing = ref(false)
const isProcessed = ref(false)
const processingProgress = ref(0)
const quranWordsData = ref([]) // { word, value, count }
const groupedByValue = ref({}) // { value: [{ text, count }] }
const searchQuery = ref("")
const viewMode = ref("grouped")
const showWordsDialog = ref(false)
const selectedValueGroup = ref(null)

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

// Stats computed
const totalUniqueWords = computed(() => quranWordsData.value.length)
const uniqueValuesCount = computed(
  () => Object.keys(groupedByValue.value).length
)
const matchingValuesCount = computed(
  () =>
    Object.values(groupedByValue.value).filter((words) => words.length > 1)
      .length
)

// Table headers
const groupedHeaders = [
  { title: "القيمة", key: "value", width: "100px", align: "center" },
  { title: "عدد الكلمات", key: "count", width: "120px", align: "center" },
  { title: "الكلمات", key: "words", sortable: false },
]

const flatHeaders = [
  { title: "الكلمة", key: "word", width: "150px" },
  { title: "القيمة", key: "value", width: "100px", align: "center" },
  { title: "التكرار", key: "count", width: "100px", align: "center" },
  { title: "كلمات مشابهة", key: "matchingWords", sortable: false },
]

// Filtered data computed
const filteredGroupedData = computed(() => {
  const data = Object.entries(groupedByValue.value)
    .map(([value, words]) => ({
      value: parseInt(value),
      count: words.length,
      words: words.sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count)

  if (!searchQuery.value) return data

  const query = searchQuery.value.trim()
  const numQuery = parseInt(query)

  return data.filter((item) => {
    if (!isNaN(numQuery) && item.value === numQuery) return true
    return item.words.some((w) => w.text.includes(query))
  })
})

const filteredFlatData = computed(() => {
  let data = quranWordsData.value
    .map((item) => ({
      ...item,
      matchingWords: (groupedByValue.value[item.value] || [])
        .filter((w) => w.text !== item.word)
        .map((w) => w.text),
    }))
    .sort((a, b) => b.count - a.count)

  if (!searchQuery.value) return data

  const query = searchQuery.value.trim()
  const numQuery = parseInt(query)

  return data.filter((item) => {
    if (!isNaN(numQuery) && item.value === numQuery) return true
    return item.word.includes(query)
  })
})

// Calculator methods
const calculateAll = () => {
  const text = inputText.value.trim()
  if (!text) {
    totalValue.value = 0
    wordBreakdown.value = []
    letterBreakdown.value = []
    return
  }

  totalValue.value = calculateValue(text)

  const words = text.split(/\s+/).filter(Boolean)
  wordBreakdown.value = words.map((word) => ({
    text: word,
    value: calculateValue(word),
  }))

  const cleanText = text.replace(
    /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED\s]/g,
    ""
  )

  const letterCounts = {}
  for (const char of cleanText) {
    const baseChar = getBaseChar(char)
    if (letterValues[baseChar]) {
      if (!letterCounts[baseChar]) {
        letterCounts[baseChar] = {
          char: baseChar,
          value: letterValues[baseChar],
          count: 0,
        }
      }
      letterCounts[baseChar].count++
    }
  }

  letterBreakdown.value = Object.values(letterCounts)
    .map((item) => ({ ...item, total: item.value * item.count }))
    .sort((a, b) => b.total - a.total)
}

const clearInput = () => {
  inputText.value = ""
  totalValue.value = 0
  wordBreakdown.value = []
  letterBreakdown.value = []
}

// Quran words processing
const processQuranWords = async () => {
  isProcessing.value = true
  processingProgress.value = 0

  await dataStore.getQuranData()

  const verses = dataStore.oneQuranFile
  if (!verses?.length) {
    isProcessing.value = false
    return
  }

  const wordMap = new Map() // word -> { word, value, count }
  const totalVerses = verses.length

  // Process in chunks to keep UI responsive
  const chunkSize = 100
  for (let i = 0; i < totalVerses; i += chunkSize) {
    const chunk = verses.slice(i, Math.min(i + chunkSize, totalVerses))

    for (const verse of chunk) {
      const cleanText = verse.verseText.replace(
        /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
        ""
      )
      const words = cleanText.split(/\s+/).filter(Boolean)

      for (const word of words) {
        if (wordMap.has(word)) {
          wordMap.get(word).count++
        } else {
          wordMap.set(word, {
            word,
            value: calculateValue(word),
            count: 1,
          })
        }
      }
    }

    processingProgress.value = Math.min(
      ((i + chunkSize) / totalVerses) * 100,
      100
    )
    await new Promise((resolve) => setTimeout(resolve, 0)) // Yield to UI
  }

  // Convert to array
  quranWordsData.value = Array.from(wordMap.values())

  // Group by value
  const grouped = {}
  for (const item of quranWordsData.value) {
    if (!grouped[item.value]) {
      grouped[item.value] = []
    }
    grouped[item.value].push({ text: item.word, count: item.count })
  }
  groupedByValue.value = grouped

  isProcessing.value = false
  isProcessed.value = true
}

const showAllWords = (item) => {
  selectedValueGroup.value = item
  showWordsDialog.value = true
}

onMounted(() => {
  dataStore.getQuranData()
})
</script>

<style>
.word-value-page {
  height: calc(100vh - 64px);
  overflow-y: auto !important;
  overflow-x: hidden;
}

.word-value-table .v-data-table__td {
  font-family: "Almarai", sans-serif;
}
</style>
