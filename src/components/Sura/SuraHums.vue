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
        <div class="text-caption text-medium-emphasis mt-1">
          <template v-if="currentWord">
            قيمة {{ currentWord.value }} · آية {{ currentWord.verseIndex }}
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
      <v-select
        v-model="scaleName"
        :items="scaleOptions"
        item-title="title"
        item-value="value"
        density="compact"
        variant="plain"
        hide-details
        class="hums-scale"
      />
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
import { calculateValue } from "@/mixins/counting"
import { toneForValue } from "@/utils/wordTone"
import { useStore } from "@/stores/appStore"

const VERSE_PAUSE = 0.8
const VOLUME = 0.25

const props = defineProps({
  verses: Array,
  tempo: { type: Number, default: 1 },
})

const store = useStore()
const theme = useTheme()
const plateRef = ref(null)
const currentIndex = ref(0)
const isPlaying = ref(false)
const isFullscreen = ref(false)
const scaleName = ref("pentatonic")
let timer = null
let audio = null
const voices = new Set()

// One short voice per word. The old page leaked oscillators because it never
// disconnected them; every node here is released and dropped.
const initAudio = () => {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audio.state === "suspended") audio.resume()
  return audio
}

const playTone = (value, seconds) => {
  const ctx = initAudio()
  const now = ctx.currentTime
  const release = Math.min(0.08, seconds / 4)
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = "sine"
  oscillator.frequency.value = toneForValue(value, scaleName.value)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(VOLUME, now + 0.01)
  gain.gain.setValueAtTime(VOLUME, now + seconds - release)
  gain.gain.linearRampToValueAtTime(0, now + seconds)

  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + seconds)
  voices.add(gain)
  oscillator.onended = () => {
    voices.delete(gain)
    oscillator.disconnect()
    gain.disconnect()
  }
}

// Pausing must silence the note already sounding, not just cancel the next one.
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

const scaleOptions = [
  { title: "خماسي", value: "pentatonic" },
  { title: "كبير", value: "major" },
  { title: "صغير", value: "minor" },
  { title: "حجاز", value: "hijaz" },
]

// One entry per word, with the timeline slot it occupies.
const timeline = computed(() => {
  if (!props.verses?.length) return []
  const slots = []
  let cursor = 0
  props.verses.forEach((verse) => {
    const words = stripTashkeel(verse.verseText || "").split(/\s+/).filter(Boolean)
    words.forEach((word, index) => {
      const duration = (0.15 + word.length * 0.05) / props.tempo
      const tail = index === words.length - 1 ? VERSE_PAUSE : 0
      slots.push({
        text: word,
        value: calculateValue(word),
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

const formatTime = (seconds) => {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

const step = () => {
  const word = currentWord.value
  if (!word) return stop()
  // The verse-end pause is silence, so the tone only lasts the word's own time.
  playTone(word.value, word.duration - (word.tail || 0))
  timer = setTimeout(() => {
    if (!isPlaying.value) return
    if (currentIndex.value >= timeline.value.length - 1) return stop()
    currentIndex.value++
    step()
  }, word.duration * 1000)
}

const play = () => {
  if (!timeline.value.length) return
  isPlaying.value = true
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

// A shorter sura, or leaving the tab, must not leave the player running.
watch(timeline, (slots) => {
  if (currentIndex.value < slots.length) return
  currentIndex.value = Math.max(slots.length - 1, 0)
})

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

onMounted(() => {
  drawPlate()
  window.addEventListener("resize", drawPlate)
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

.hums-time {
  min-width: 34px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.hums-scale {
  max-width: 90px;
}

:deep(.hums-scale .v-field__input) {
  padding: 0;
  min-height: 24px;
  font-size: 0.75rem;
}
</style>
