<template>
  <v-container class="quran-sound-page py-4 pb-16" fluid>
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="8">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1
            class="text-h4 font-weight-bold mb-2"
            style="font-family: 'Almarai', sans-serif"
          >
            صوت القرآن العددي
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            استمع إلى القيم العددية للكلمات كأصوات موسيقية متناغمة
          </p>
        </div>

        <!-- Controls Card -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-text class="pa-6">
            <v-row>
              <!-- Sura Selection -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="selectedSura"
                  :items="suraList"
                  item-title="name"
                  item-value="number"
                  label="اختر السورة"
                  variant="outlined"
                  prepend-inner-icon="mdi-book-open-page-variant"
                  dir="rtl"
                  :loading="isLoading"
                  @update:model-value="loadSuraVerses"
                />
              </v-col>

              <!-- Verse Selection -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedVerse"
                  :items="verseOptions"
                  label="اختر الآية"
                  variant="outlined"
                  prepend-inner-icon="mdi-format-list-numbered"
                  dir="rtl"
                  :disabled="!selectedSura"
                />
              </v-col>
            </v-row>

            <!-- Sound Settings -->
            <v-expansion-panels class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon start>mdi-tune</v-icon>
                  إعدادات الصوت
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="waveType"
                        :items="waveTypes"
                        label="نوع الموجة"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="scaleType"
                        :items="scaleTypes"
                        label="السلم الموسيقي"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="tempo"
                        :min="0.2"
                        :max="2"
                        :step="0.1"
                        label="السرعة"
                        thumb-label
                        color="primary"
                      >
                        <template v-slot:append>
                          <span class="text-caption">{{ tempo }}x</span>
                        </template>
                      </v-slider>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="volume"
                        :min="0"
                        :max="1"
                        :step="0.1"
                        label="مستوى الصوت"
                        thumb-label
                        color="primary"
                      >
                        <template v-slot:append>
                          <v-icon>{{ volume > 0.5 ? 'mdi-volume-high' : volume > 0 ? 'mdi-volume-medium' : 'mdi-volume-off' }}</v-icon>
                        </template>
                      </v-slider>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="baseFrequency"
                        :min="100"
                        :max="500"
                        :step="10"
                        label="التردد الأساسي (Hz)"
                        thumb-label
                        color="primary"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="phraseLength"
                        :min="2"
                        :max="6"
                        :step="1"
                        label="كلمات في كل نبضة"
                        thumb-label
                        color="primary"
                      >
                        <template v-slot:append>
                          <span class="text-caption">{{ phraseLength }}</span>
                        </template>
                      </v-slider>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="phrasePause"
                        :min="0.1"
                        :max="1"
                        :step="0.1"
                        label="وقفة بين النبضات (ث)"
                        thumb-label
                        color="primary"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-slider
                        v-model="versePause"
                        :min="0.5"
                        :max="2"
                        :step="0.1"
                        label="وقفة بين الآيات (ث)"
                        thumb-label
                        color="primary"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Play Controls -->
            <div class="d-flex justify-center gap-4 mt-6">
              <v-btn
                :color="isPlaying ? 'error' : 'primary'"
                size="x-large"
                :disabled="!currentWords.length"
                @click="togglePlay"
              >
                <v-icon start>{{ isPlaying ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                {{ isPlaying ? 'إيقاف' : 'تشغيل' }}
              </v-btn>
              <v-btn
                variant="outlined"
                size="x-large"
                :disabled="!currentWords.length || isPlaying"
                @click="playAll"
              >
                <v-icon start>mdi-playlist-play</v-icon>
                تشغيل الكل
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Current Verse Display -->
        <v-card v-if="currentVerseText" class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="pa-4">
            <v-icon start color="primary">mdi-text-box</v-icon>
            نص الآية
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <div class="text-h5 text-center" dir="rtl" style="line-height: 2.5">
              <template v-for="(word, index) in currentWords" :key="index">
                <span
                  :class="{
                    'current-word': currentWordIndex === index,
                    'played-word': currentWordIndex > index,
                    'phrase-end': (index + 1) % phraseLength === 0 && !word.isVerseEnd,
                  }"
                  class="word-span mx-1"
                  @click="playWord(index)"
                >
                  {{ word.text }}
                </span>
                <span v-if="word.isVerseEnd" class="verse-marker mx-2">۝</span>
              </template>
            </div>
          </v-card-text>
        </v-card>

        <!-- Visualization -->
        <v-card v-if="currentWords.length" class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="pa-4">
            <v-icon start color="primary">mdi-chart-line</v-icon>
            التصور البصري
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <!-- Frequency Bars -->
            <div class="frequency-visualizer">
              <div
                v-for="(word, index) in currentWords"
                :key="index"
                class="frequency-bar-container"
                :style="{ width: `${100 / currentWords.length}%` }"
              >
                <div
                  class="frequency-bar"
                  :class="{ active: currentWordIndex === index, played: currentWordIndex > index }"
                  :style="{
                    height: `${Math.min((word.value / maxWordValue) * 100, 100)}%`,
                    backgroundColor: getColorForValue(word.value),
                  }"
                />
                <div class="frequency-label text-caption">
                  {{ word.value }}
                </div>
              </div>
            </div>

            <!-- Word Values Table -->
            <v-table density="compact" class="mt-4">
              <thead>
                <tr>
                  <th class="text-center">#</th>
                  <th class="text-center">آية</th>
                  <th class="text-right">الكلمة</th>
                  <th class="text-center">القيمة</th>
                  <th class="text-center">التردد (Hz)</th>
                  <th class="text-center">تشغيل</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(word, index) in currentWords"
                  :key="index"
                  :class="{
                    'bg-primary-lighten': currentWordIndex === index,
                    'verse-end-row': word.isVerseEnd,
                  }"
                >
                  <td class="text-center">{{ index + 1 }}</td>
                  <td class="text-center">
                    <v-chip size="x-small" variant="outlined">
                      {{ word.verseIndex }}
                    </v-chip>
                  </td>
                  <td class="text-right text-h6">
                    {{ word.text }}
                    <v-icon v-if="word.isVerseEnd" size="small" color="primary" class="mr-1">
                      mdi-checkbox-blank-circle
                    </v-icon>
                  </td>
                  <td class="text-center">
                    <v-chip color="primary" variant="tonal" size="small">
                      {{ word.value }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    {{ getFrequencyForValue(word.value).toFixed(1) }}
                  </td>
                  <td class="text-center">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="playWord(index)"
                    >
                      <v-icon>mdi-play-circle</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Info Card -->
        <v-card variant="tonal" color="info" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-start">
              <v-icon class="ml-3 mt-1">mdi-information</v-icon>
              <div>
                <p class="text-body-2 mb-2">
                  <strong>كيف يعمل:</strong> كل كلمة لها قيمة عددية محسوبة من حروفها.
                  هذه القيمة تُحوَّل إلى تردد صوتي (Hz) لإنتاج نغمة موسيقية.
                </p>
                <p class="text-body-2 mb-0">
                  <strong>تلميح:</strong> جرّب السلالم الموسيقية المختلفة لتجربة أصوات متنوعة.
                  انقر على أي كلمة لسماع صوتها منفردة.
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { calculateValue } from "@/mixins/counting"

const dataStore = useDataStore()

// State
const isLoading = ref(true)
const selectedSura = ref(null)
const selectedVerse = ref("all")
const suraVerses = ref([])
const isPlaying = ref(false)
const currentWordIndex = ref(-1)

// Audio settings
const waveType = ref("sine")
const scaleType = ref("pentatonic")
const tempo = ref(1)
const volume = ref(0.5)
const baseFrequency = ref(220)
const phraseLength = ref(3)
const phrasePause = ref(0.3)
const versePause = ref(0.8)

// Audio context
let audioContext = null
let currentOscillator = null
let gainNode = null
let playbackTimeout = null

// Options
const waveTypes = [
  { title: "موجة جيبية (ناعمة)", value: "sine" },
  { title: "موجة مربعة (حادة)", value: "square" },
  { title: "موجة مثلثية (دافئة)", value: "triangle" },
  { title: "موجة منشارية (غنية)", value: "sawtooth" },
]

const scaleTypes = [
  { title: "خماسي (Pentatonic)", value: "pentatonic" },
  { title: "كبير (Major)", value: "major" },
  { title: "صغير (Minor)", value: "minor" },
  { title: "عربي (Hijaz)", value: "hijaz" },
  { title: "خطي (Linear)", value: "linear" },
]

// Musical scales (ratios from base frequency)
const scales = {
  pentatonic: [1, 1.125, 1.25, 1.5, 1.667, 2],
  major: [1, 1.122, 1.26, 1.335, 1.498, 1.682, 1.888, 2],
  minor: [1, 1.122, 1.189, 1.335, 1.498, 1.587, 1.782, 2],
  hijaz: [1, 1.059, 1.26, 1.335, 1.498, 1.587, 1.888, 2],
  linear: null, // Direct frequency mapping
}

// Computed
const suraList = computed(() => {
  const index = dataStore.QuranIndex
  if (!index?.length) return []
  return index.slice(1).map((sura, idx) => ({
    number: idx + 1,
    name: `${idx + 1}. ${sura.fileName.replace(/[0-9]/g, "")}`,
  }))
})

const verseOptions = computed(() => {
  if (!suraVerses.value.length) return []
  const options = [{ title: "جميع الآيات", value: "all" }]
  suraVerses.value.forEach((v, idx) => {
    options.push({ title: `آية ${idx + 1}`, value: idx })
  })
  return options
})

const currentVerseText = computed(() => {
  if (selectedVerse.value === "all") {
    return suraVerses.value.map((v) => v.verseText).join(" ")
  }
  return suraVerses.value[selectedVerse.value]?.verseText || ""
})

const currentWords = computed(() => {
  if (selectedVerse.value === "all" && suraVerses.value.length) {
    // Process all verses, marking verse endings
    const words = []
    suraVerses.value.forEach((verse, verseIdx) => {
      const cleanText = verse.verseText.replace(
        /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
        ""
      )
      const verseWords = cleanText.split(/\s+/).filter(Boolean)
      verseWords.forEach((word, wordIdx) => {
        words.push({
          text: word,
          value: calculateValue(word),
          verseIndex: verseIdx + 1,
          isVerseEnd: wordIdx === verseWords.length - 1,
        })
      })
    })
    return words
  }

  // Single verse
  if (!currentVerseText.value) return []
  const cleanText = currentVerseText.value.replace(
    /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
    ""
  )
  const words = cleanText.split(/\s+/).filter(Boolean)
  return words.map((word, idx) => ({
    text: word,
    value: calculateValue(word),
    verseIndex: 1,
    isVerseEnd: idx === words.length - 1,
  }))
})

const maxWordValue = computed(() => {
  if (!currentWords.value.length) return 1
  return Math.max(...currentWords.value.map((w) => w.value))
})

// Methods
const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioContext.state === "suspended") {
    audioContext.resume()
  }
}

const getFrequencyForValue = (value) => {
  if (scaleType.value === "linear") {
    // Direct mapping: value * base frequency ratio
    return baseFrequency.value + value * 5
  }

  // Map value to scale degree
  const scale = scales[scaleType.value]
  const degree = value % scale.length
  const octave = Math.floor(value / scale.length)
  const frequency = baseFrequency.value * scale[degree] * Math.pow(2, octave)

  // Keep frequency in audible range
  return Math.min(Math.max(frequency, 100), 2000)
}

const getColorForValue = (value) => {
  const hue = (value * 137.5) % 360 // Golden angle for color distribution
  return `hsl(${hue}, 70%, 50%)`
}

const playTone = (frequency, duration = 0.5, attack = 0.05, release = 0.1) => {
  initAudio()

  const oscillator = audioContext.createOscillator()
  const envelope = audioContext.createGain()

  oscillator.type = waveType.value
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

  // Create envelope for smooth sound
  envelope.gain.setValueAtTime(0, audioContext.currentTime)
  envelope.gain.linearRampToValueAtTime(
    volume.value,
    audioContext.currentTime + attack
  )
  envelope.gain.setValueAtTime(
    volume.value,
    audioContext.currentTime + duration - release
  )
  envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

  oscillator.connect(envelope)
  envelope.connect(audioContext.destination)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)

  return oscillator
}

const playWord = (index) => {
  if (index < 0 || index >= currentWords.value.length) return

  const word = currentWords.value[index]
  const frequency = getFrequencyForValue(word.value)
  const duration = (0.3 + word.text.length * 0.1) / tempo.value

  currentWordIndex.value = index
  playTone(frequency, duration)

  setTimeout(() => {
    if (currentWordIndex.value === index && !isPlaying.value) {
      currentWordIndex.value = -1
    }
  }, duration * 1000)
}

const playSequence = async (startIndex = 0) => {
  if (!currentWords.value.length) return

  isPlaying.value = true
  currentWordIndex.value = startIndex

  const playNext = (index, wordInPhrase = 0) => {
    if (!isPlaying.value || index >= currentWords.value.length) {
      isPlaying.value = false
      currentWordIndex.value = -1
      return
    }

    const word = currentWords.value[index]
    const frequency = getFrequencyForValue(word.value)
    
    // Shorter, more rhythmic duration for beat-like feel
    const baseDuration = 0.15 + word.text.length * 0.05
    const duration = baseDuration / tempo.value

    currentWordIndex.value = index
    playTone(frequency, duration, 0.02, 0.05)

    // Calculate delay to next note
    let delay = duration * 1000

    // Check if this is a phrase boundary (every N words)
    const isPhraseBoundary = (wordInPhrase + 1) >= phraseLength.value
    
    // Check if this is a verse ending
    const isVerseEnd = word.isVerseEnd

    if (isVerseEnd) {
      // Longer pause at verse end
      delay += versePause.value * 1000
    } else if (isPhraseBoundary) {
      // Pause between phrases (beats)
      delay += phrasePause.value * 1000
    } else {
      // Small gap between words in same phrase
      delay += 50 / tempo.value
    }

    playbackTimeout = setTimeout(() => {
      const nextWordInPhrase = isPhraseBoundary || isVerseEnd ? 0 : wordInPhrase + 1
      playNext(index + 1, nextWordInPhrase)
    }, delay)
  }

  playNext(startIndex, 0)
}

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlayback()
  } else {
    playSequence(Math.max(0, currentWordIndex.value))
  }
}

const playAll = () => {
  stopPlayback()
  playSequence(0)
}

const stopPlayback = () => {
  isPlaying.value = false
  currentWordIndex.value = -1
  if (playbackTimeout) {
    clearTimeout(playbackTimeout)
    playbackTimeout = null
  }
}

const loadSuraVerses = async () => {
  if (!selectedSura.value) return

  await dataStore.getQuranData()

  const quranIndex = dataStore.QuranIndex
  const allVerses = dataStore.oneQuranFile

  if (!quranIndex?.length || !allVerses?.length) return

  const suraInfo = quranIndex[selectedSura.value]
  if (!suraInfo) return

  const startIndex = suraInfo.verseNumberToQuran - 1
  const endIndex = startIndex + suraInfo.numberOfVerses

  suraVerses.value = allVerses.slice(startIndex, endIndex)
  selectedVerse.value = "all"
  stopPlayback()
}

// Watch for verse change
watch(selectedVerse, () => {
  stopPlayback()
})

onMounted(async () => {
  isLoading.value = true
  await dataStore.getQuranData()
  isLoading.value = false

  // Default to Al-Falaq
  selectedSura.value = 113
  await loadSuraVerses()
})

onUnmounted(() => {
  stopPlayback()
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style>
.quran-sound-page {
  height: calc(100vh - 64px);
  overflow-y: auto !important;
  overflow-x: hidden;
}

.word-span {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.word-span:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.current-word {
  background-color: rgba(var(--v-theme-primary), 0.3);
  transform: scale(1.1);
  font-weight: bold;
}

.played-word {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.frequency-visualizer {
  display: flex;
  align-items: flex-end;
  height: 150px;
  gap: 4px;
  padding: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}

.frequency-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 20px;
}

.frequency-bar {
  width: 100%;
  max-width: 40px;
  min-height: 10px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.frequency-bar.active {
  opacity: 1;
  transform: scaleY(1.1);
  box-shadow: 0 0 10px currentColor;
}

.frequency-bar.played {
  opacity: 0.3;
}

.frequency-label {
  margin-top: 4px;
  text-align: center;
}

.bg-primary-lighten {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.verse-marker {
  color: rgb(var(--v-theme-primary));
  font-size: 1.2em;
  opacity: 0.7;
}

.phrase-end {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 8px;
}

.verse-end-row {
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.3);
}
</style>

