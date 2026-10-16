<template>
  <div
    class="hums-stage sura-board-overflow"
    :class="{ 'hums-fullscreen': isFullscreen }"
  >
    <div class="hums-plate">
      <canvas ref="plateRef" />
      <v-btn
        v-if="isFullscreen"
        class="hums-exit"
        icon="mdi-fullscreen-exit"
        variant="tonal"
        size="small"
        @click="isFullscreen = false"
      />
      <div class="hums-word text-center">
        <div class="text-h4">{{ currentWord?.text || "—" }}</div>
        <div class="hums-notes d-flex justify-center flex-wrap ga-1 mt-2">
          <v-chip
            v-for="(note, index) in currentNotes"
            :key="index"
            size="small"
            variant="tonal"
          >
            {{ note.letter }} {{ note.hz }}
          </v-chip>
        </div>
        <div class="text-caption text-medium-emphasis mt-2">
          <template v-if="currentWord">
            آية {{ currentWord.verseIndex }} · {{ currentWord.notes.length }} حرف
          </template>
        </div>
      </div>
    </div>

    <div class="hums-player d-flex flex-row-reverse align-center ga-2 px-2 py-1">
      <v-btn
        :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
        variant="text"
        size="large"
        :disabled="!timeline.length"
        @click="isPlaying ? stop() : play()"
      />
      <span class="hums-time text-caption">{{ formatTime(position) }}</span>
      <!-- The app is RTL, but a player scrubber reads left to right. -->
      <v-locale-provider :rtl="false" class="flex-grow-1">
        <v-slider
          v-model="currentIndex"
          :min="0"
          :max="Math.max(timeline.length - 1, 0)"
          :step="1"
          hide-details
          density="compact"
        />
      </v-locale-provider>
      <span class="hums-time text-caption">{{ formatTime(total) }}</span>
      <v-btn
        icon="mdi-repeat"
        variant="text"
        size="small"
        :color="isLooping ? 'primary' : undefined"
        :title="isLooping ? 'تكرار: مفعّل' : 'تكرار: متوقف'"
        @click="isLooping = !isLooping"
      />
      <v-chip
        size="small"
        variant="text"
        class="hums-hint"
        :color="multiplierWarning ? 'warning' : undefined"
      >
        {{ multiplierWarning || `تردد الحرف ÷ ${LETTER_DIVISOR}` }}
      </v-chip>
      <v-menu location="top">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-speedometer"
            variant="text"
            size="small"
            :title="`السرعة ${speed}x`"
          />
        </template>
        <v-list density="compact" class="pa-3" min-width="240">
          <div class="text-caption text-medium-emphasis mb-1">السرعة {{ speed }}x</div>
          <v-slider
            v-model="speed"
            :min="0.25"
            :max="4"
            :step="0.25"
            hide-details
            density="compact"
            thumb-label
            color="primary"
          />
        </v-list>
      </v-menu>
      <v-menu location="top">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            variant="text"
            size="small"
            class="hums-multiplier"
            :title="multiplierWarning || `تردد الحرف ÷ ${LETTER_DIVISOR}`"
          >
            ×{{ multiplier }}
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            v-for="item in multipliers"
            :key="item.value"
            :title="item.title"
            :active="item.value === multiplier"
            @click="multiplier = item.value"
          />
        </v-list>
      </v-menu>
      <v-btn
        icon="mdi-fullscreen"
        variant="text"
        size="small"
        @click="isFullscreen = true"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useTheme } from "vuetify"
import { getBaseChar } from "@/utils/letterUtils"
import {
  AUDIBLE_MAX_HZ,
  AUDIBLE_MIN_HZ,
  LETTER_DIVISOR,
  MULTIPLIERS,
  toneForLetter,
} from "@/utils/wordTone"
import { useDataStore } from "@/stores/dataStore"
import { useStore } from "@/stores/appStore"

const VERSE_PAUSE = 0.6
const LETTER_SECONDS = 0.14
const VOLUME = 0.25

const props = defineProps({
  verses: Array,
})

const store = useStore()
const dataStore = useDataStore()
const theme = useTheme()
const plateRef = ref(null)
const currentIndex = ref(0)
const isPlaying = ref(false)
const isLooping = ref(false)
const isFullscreen = ref(false)
// Kept in the form the UI shows: 1 is the faithful speed, letters at 140ms.
const speed = ref(1)
const multiplier = ref(1)
let timer = null
let audio = null
const voices = new Set()

// Each letter plays its own Quran-wide frequency, scaled by the multiplier.
// A word's letters sound in order, so a word is heard as a short phrase.
const letterCounts = computed(() => dataStore.getQuranLetterCounts)
const letterHz = (letter) =>
  toneForLetter(letter, letterCounts.value, multiplier.value)

// Sets outside the audible band go quiet instead of erroring, so warn about them.
const multiplierWarning = computed(() => {
  const hz = Object.keys(letterCounts.value || {}).map((letter) => letterHz(letter))
  if (!hz.length) return ""
  if (Math.min(...hz) < AUDIBLE_MIN_HZ) return "أخفض من مدى السمع"
  if (Math.max(...hz) > AUDIBLE_MAX_HZ) return "أعلى من مدى السمع"
  return ""
})

const multipliers = MULTIPLIERS.map((value) => ({ title: `×${value}`, value }))

// One short voice per letter. The old page leaked oscillators because it never
// disconnected them; every node here is released and dropped.
const initAudio = () => {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audio.state === "suspended") audio.resume()
  return audio
}

const playNotes = (notes) => {
  if (!notes?.length) return
  const ctx = initAudio()
  const step = LETTER_SECONDS / speed.value
  const release = Math.min(0.05, step / 4)
  notes.forEach((letter, index) => {
    const frequency = letterHz(letter)
    if (!frequency) return
    // Scheduled ahead from one clock, so consecutive same letters stay distinct.
    const when = ctx.currentTime + index * step
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = "sawtooth"
    oscillator.frequency.value = frequency
    const tilt = Math.min(1, Math.max(0.35, 900 / frequency))
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(VOLUME * tilt, when + 0.008)
    gain.gain.setValueAtTime(VOLUME * tilt, when + step - release)
    gain.gain.linearRampToValueAtTime(0, when + step)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(when)
    oscillator.stop(when + step)
    voices.add(gain)
    oscillator.onended = () => {
      voices.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
    }
  })
}

// Pausing must silence the notes already sounding, not just cancel the next one.
const silenceVoices = () => {
  if (!audio) return
  const now = audio.currentTime
  voices.forEach((gain) => {
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.05)
  })
}

const stripTashkeel = (text) =>
  text.replace(/[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g, "")

// The letters a word sounds, in order. Repeated letters replay, so a word is
// the sequence of its letters, not its set of them.
const notesFor = (word) =>
  stripTashkeel(word)
    .split("")
    .filter((char) => /[\u0621-\u063A\u0641-\u064A]/.test(char))
    .map((char) => getBaseChar(char))

// One entry per word. Each carries its letters, which the sound walks in order.
const timeline = computed(() => {
  if (!props.verses?.length) return []
  const steps = LETTER_SECONDS / speed.value
  const pause = VERSE_PAUSE / speed.value
  const slots = []
  let cursor = 0
  props.verses.forEach((verse) => {
    const words = stripTashkeel(verse.verseText || "").split(/\s+/).filter(Boolean)
    words.forEach((word, index) => {
      const notes = notesFor(word)
      if (!notes.length) return
      const duration = notes.length * steps
      const tail = index === words.length - 1 ? pause : 0
      slots.push({
        text: word,
        notes,
        verseIndex: verse.verseIndex,
        tail,
        start: cursor,
        duration: duration + tail,
      })
      cursor += duration + tail
    })
  })
  return slots
})

const total = computed(() =>
  timeline.value.length
    ? timeline.value[timeline.value.length - 1].start +
      timeline.value[timeline.value.length - 1].duration
    : 0,
)
const currentWord = computed(() => timeline.value[currentIndex.value])
const position = computed(() => currentWord.value?.start || 0)
// The word's letters and their frequencies, so the mapping is visible.
const currentNotes = computed(() =>
  (currentWord.value?.notes || []).map((letter) => ({
    letter,
    hz: Math.round(letterHz(letter)),
  })),
)

const formatTime = (seconds) => {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

const step = () => {
  const index = currentIndex.value
  const word = timeline.value[index]
  if (!word) return stop()
  playNotes(word.notes)
  // The tick only advances the index; the watch below starts the next word, so
  // a scrub and the timeline share one path.
  timer = setTimeout(() => {
    if (!isPlaying.value) return
    if (index < timeline.value.length - 1) return currentIndex.value++
    if (isLooping.value) return (currentIndex.value = 0)
    stop()
  }, word.duration * 1000)
}

// Scrubbing jumps the sound to the newly picked word.
watch(currentIndex, () => {
  if (!isPlaying.value) return
  clearTimeout(timer)
  silenceVoices()
  step()
})

const play = () => {
  if (!timeline.value.length) return
  isPlaying.value = true
  step()
}

// Speed and multiplier rebuild the timeline, so the sounding word must restart
// at the new pitch and the new length.
const restart = () => {
  if (!isPlaying.value) return
  clearTimeout(timer)
  silenceVoices()
  step()
}

const stop = () => {
  isPlaying.value = false
  clearTimeout(timer)
  timer = null
  silenceVoices()
}

// The plate stands in for the cymatics field: frequency picks the mode, the
// mode sets where the sand gathers.
const drawPlate = () => {
  const canvas = plateRef.value
  if (!canvas) return
  const box = canvas.parentElement
  const size = Math.min(box.clientWidth, box.clientHeight)
  if (!size) return
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  const ctx = canvas.getContext("2d")
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)
  ctx.globalAlpha = 0.25
  ctx.strokeStyle = theme.current.value.colors.primary
  ctx.lineWidth = 1
  const r = size / 2
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath()
    ctx.arc(r, r, (r * i) / 4, 0, Math.PI * 2)
    ctx.stroke()
  }
}

// A speed change rebuilds the timeline, so clamp the index and restart the
// sounding word at its new length. Clamping already triggers the index watch
// above, so only restart here when the index stayed put.
watch(timeline, (slots) => {
  const clamped = Math.max(slots.length - 1, 0)
  if (currentIndex.value > clamped) return (currentIndex.value = clamped)
  restart()
})

// The multiplier changes pitch only, so the timeline stays put and this watch
// is what restarts the sound.
watch(multiplier, restart)

watch(
  () => store.getActiveSuraTab,
  (tab) => {
    if (tab !== "hums") stop()
  },
)

watch(isFullscreen, async () => {
  await new Promise((resolve) => requestAnimationFrame(resolve))
  drawPlate()
})

onMounted(async () => {
  drawPlate()
  window.addEventListener("resize", drawPlate)
  // Letter counts are the source of the frequencies, so make sure they landed.
  await dataStore.getQuranData()
})

onUnmounted(() => {
  stop()
  window.removeEventListener("resize", drawPlate)
  if (audio) {
    audio.close()
    audio = null
  }
})
</script>

<style scoped>
.hums-stage {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hums-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2400;
  height: 100dvh;
  background: rgb(var(--v-theme-background));
}

.hums-plate {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.hums-exit {
  position: absolute;
  top: 8px;
  inset-inline-start: 8px;
}

.hums-word {
  position: absolute;
}

.hums-player {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.hums-notes {
  min-height: 28px;
}

.hums-time {
  min-width: 34px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.hums-multiplier {
  min-width: 52px;
}

.hums-hint {
  max-width: 40vw;
}

/* Phone: the buttons alone fill the bar, so give the scrubber its own row
   instead of letting it collapse to nothing. The locale provider is
   display:contents, so the slider itself is the flex item to size. */
@media (max-width: 600px) {
  .hums-player {
    flex-wrap: wrap;
    gap: 4px !important;
  }

  .hums-player .v-slider {
    order: -1;
    flex: 0 0 100%;
    margin-inline: 0;
  }

  .hums-hint {
    display: none;
  }
}
</style>
