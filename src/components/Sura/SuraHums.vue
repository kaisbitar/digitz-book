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

// The scarcest letter sets the smallest figure, so the plate spans its range.
const minCount = computed(() => {
  const values = Object.values(letterCounts.value || {})
  return values.length ? Math.min(...values) : 1
})

// One short voice per letter. The old page leaked oscillators because it never
// disconnected them; every node here is released and dropped.
const initAudio = () => {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audio.state === "suspended") audio.resume()
  return audio
}

// The ear is least sensitive at the bottom, where the cheapest letters sit.
const tiltFor = (frequency) => Math.min(1, Math.max(0.35, 900 / frequency))

// One oscillator per word: the pitch slides between letters, so the word is one
// phrase instead of separate blips. Each letter still holds its own exact
// frequency for the rest of its step, so nothing is smeared away.
const GLIDE = 0.35

const playNotes = (notes) => {
  const live = (notes || []).filter((letter) => letterHz(letter))
  if (!live.length) return
  const ctx = initAudio()
  const step = LETTER_SECONDS / speed.value
  const start = ctx.currentTime
  const end = start + live.length * step
  const attack = Math.min(0.008, step / 4)
  const release = Math.min(0.05, step / 4)
  const glide = step * GLIDE
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const first = letterHz(live[0])

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(first, start)
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(VOLUME * tiltFor(first), start + attack)

  live.forEach((letter, index) => {
    if (!index) return
    const at = start + index * step
    const from = letterHz(live[index - 1])
    const to = letterHz(letter)
    const arrive = Math.min(at + glide, end)
    // Hold the previous pitch until this step, then slide onto the new one.
    oscillator.frequency.setValueAtTime(from, at)
    oscillator.frequency.linearRampToValueAtTime(to, arrive)
    gain.gain.setValueAtTime(VOLUME * tiltFor(from), at)
    gain.gain.linearRampToValueAtTime(VOLUME * tiltFor(to), arrive)
  })

  const last = letterHz(live[live.length - 1])
  gain.gain.setValueAtTime(
    VOLUME * tiltFor(last),
    Math.max(end - release, start + attack),
  )
  gain.gain.linearRampToValueAtTime(0, end)

  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(end)
  voices.add(gain)
  oscillator.onended = () => {
    voices.delete(gain)
    oscillator.disconnect()
    gain.disconnect()
  }
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
  startDrive(word.notes)
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
  drive = null
  showStaticMode()
}

// A real plate resonates only at integer modes, where pitch grows with m^2+n^2,
// so the figure is chosen by the letter's own count ratio and not by its
// transposed Hz. That keeps the shape the same at every multiplier.
const MAX_MODE = 9
const MODE_BASE = 2.2
// 28 letters at most, so one small cache keeps the per-frame lookup free.
const modeCache = {}

const modeFor = (letter) => {
  const cache = modeCache
  if (cache[letter]) return cache[letter]
  const counts = letterCounts.value || {}
  const count = counts[letter]
  if (!count) return (cache[letter] = { m: 1, n: 1 })
  const target = (count / minCount.value) * MODE_BASE
  let best = { m: 1, n: 1, err: Infinity }
  for (let m = 1; m <= MAX_MODE; m++) {
    for (let n = m; n <= MAX_MODE; n++) {
      const err = Math.abs(m * m + n * n - target)
      if (err < best.err) best = { m, n, err }
    }
  }
  return (cache[letter] = best)
}

const SAMPLE = 3
const SAND = 2400

// |field| is the local vibration amplitude: zero is a nodal line, where sand rests.
const fieldAt = (m, n, x, y) =>
  Math.abs(Math.sin(m * Math.PI * x) * Math.sin(n * Math.PI * y))

let plate = null
let sand = null
let fieldImage = null
let fieldKey = ""
let rafId = null
let drive = null

// Sand walks downhill to the nearest nodal line. This runs only when the mode
// changes, not per frame.
const settleSand = () => {
  const { m, n, rest } = plate
  for (let i = 0; i < SAND; i++) {
    let x = plate.seed[i * 2]
    let y = plate.seed[i * 2 + 1]
    for (let k = 0; k < 12; k++) {
      const h = 0.02
      const gx =
        (fieldAt(m, n, x + h, y) - fieldAt(m, n, x - h, y)) / (2 * h)
      const gy =
        (fieldAt(m, n, x, y + h) - fieldAt(m, n, x, y - h)) / (2 * h)
      x = Math.min(1, Math.max(0, x - gx * 0.35))
      y = Math.min(1, Math.max(0, y - gy * 0.35))
    }
    rest[i * 2] = x
    rest[i * 2 + 1] = y
  }
}

// The nodal lines, drawn once per mode into an offscreen canvas and blitted.
const paintField = () => {
  const { size, m, n } = plate
  const cells = Math.ceil(size / SAMPLE)
  if (!fieldImage || fieldImage.width !== cells) {
    fieldImage = document.createElement("canvas")
    fieldImage.width = cells
    fieldImage.height = cells
    plate.fieldCtx = fieldImage.getContext("2d")
    plate.fieldData = plate.fieldCtx.createImageData(cells, cells)
  }
  const data = plate.fieldData.data
  const tint = theme.current.value.colors.primary
  const rgb = [
    parseInt(tint.slice(1, 3), 16),
    parseInt(tint.slice(3, 5), 16),
    parseInt(tint.slice(5, 7), 16),
  ]
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      // Bright where the sand will gather, faint in the moving regions.
      const amplitude = fieldAt(m, n, i / cells, j / cells)
      const alpha = Math.round((1 - amplitude) ** 3 * 120)
      const p = (j * cells + i) * 4
      data[p] = rgb[0]
      data[p + 1] = rgb[1]
      data[p + 2] = rgb[2]
      data[p + 3] = alpha
    }
  }
  plate.fieldCtx.putImageData(plate.fieldData, 0, 0)
}

const rebuildField = () => {
  if (!plate) return
  const letter = drive?.letters[drive.index] || drive?.letters[0]
  const { m, n } = modeFor(letter)
  const key = `${m}:${n}`
  if (key === fieldKey) return
  fieldKey = key
  plate.m = m
  plate.n = n
  paintField()
  settleSand()
  plate.sandColor = canvasRgb(plateRef.value, "--v-theme-on-surface")
}

// Reading a CSS variable forces a style recalc, so do it once per mode change
// rather than on every frame.
const canvasRgb = (canvas, name) => {
  if (!canvas) return "0,0,0"
  return getComputedStyle(canvas).getPropertyValue(name).trim() || "0,0,0"
}

const frame = () => {
  rafId = requestAnimationFrame(frame)
  const canvas = plateRef.value
  if (!canvas || !plate || !sand) return
  const { size } = plate
  const ctx = canvas.getContext("2d")
  // An idle plate shows a still mode; only real playback drives it.
  const playing = isPlaying.value && !!drive

  // Where each letter is in its own step, so the plate pulses with the pitch.
  let pulse = 0
  if (playing) {
    const elapsed = performance.now() - drive.start
    drive.index = Math.min(
      drive.letters.length - 1,
      Math.floor(elapsed / drive.stepMs),
    )
    const inStep = (elapsed % drive.stepMs) / drive.stepMs
    pulse = Math.sin(Math.PI * Math.min(inStep / 0.35, 1))
  }

  rebuildField()
  const { rest, sandColor } = plate

  ctx.setTransform(dprSize(canvas), 0, 0, dprSize(canvas), 0, 0)
  ctx.clearRect(0, 0, size, size)

  if (fieldImage) {
    ctx.globalAlpha = playing ? 0.5 : 0.22
    ctx.drawImage(fieldImage, 0, 0, size, size)
  }

  // Sand falls to the nodal lines; while driven it also jitters in place.
  const jitter = pulse * 0.012
  ctx.fillStyle = `rgb(${sandColor} / ${playing ? 0.9 : 0.5})`
  for (let i = 0; i < SAND; i++) {
    const tx = rest[i * 2]
    const ty = rest[i * 2 + 1]
    sand[i * 2] += (tx - sand[i * 2]) * 0.2
    sand[i * 2 + 1] += (ty - sand[i * 2 + 1]) * 0.2
    const x = sand[i * 2] * size + (Math.random() - 0.5) * jitter * size
    const y = sand[i * 2 + 1] * size + (Math.random() - 0.5) * jitter * size
    ctx.fillRect(x, y, 1.6, 1.6)
  }

  // A ring brightens with each letter so the plate reads as being driven.
  ctx.globalAlpha = 0.15 + pulse * 0.5
  ctx.strokeStyle = theme.current.value.colors.primary
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1
}

const dprSize = (canvas) => Number(canvas.dataset.dpr || 1)

// Drawing starts on mount and stops when the tab goes away, so no rAF is left
// running for a hidden plate.
const startPlate = () => {
  if (rafId) return
  rafId = requestAnimationFrame(frame)
}

const stopPlate = () => {
  cancelAnimationFrame(rafId)
  rafId = null
}

const resizePlate = () => {
  const canvas = plateRef.value
  if (!canvas) return
  const box = canvas.parentElement
  const size = Math.max(Math.min(box.clientWidth, box.clientHeight), 1)
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  canvas.dataset.dpr = String(dpr)
  const kept = sand
  plate = {
    size,
    m: 0,
    n: 0,
    seed: new Float32Array(SAND * 2),
    rest: new Float32Array(SAND * 2),
  }
  for (let i = 0; i < SAND; i++) {
    plate.seed[i * 2] = Math.random()
    plate.seed[i * 2 + 1] = Math.random()
  }
  // Keep the sand where it was so a fullscreen toggle does not scatter it.
  sand = kept && kept.length === SAND * 2 ? kept : plate.seed.slice()
  fieldKey = ""
  rebuildField()
}

// One entry per letter of the word being played, so the plate retunes itself.
const startDrive = (notes) => {
  const letters = (notes || []).filter((letter) => letterHz(letter))
  if (!letters.length) return
  drive = {
    letters,
    index: 0,
    start: performance.now(),
    stepMs: (LETTER_SECONDS / speed.value) * 1000,
  }
}

// Not playing: the plate still shows the mode of the word under the cursor.
const showStaticMode = () => {
  if (drive) return
  const letters = currentWord.value?.notes || []
  drive = letters.length ? { letters, index: 0, start: 0, stepMs: 1e9 } : null
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
// is what restarts the sound. The plate keeps its shape, which is chosen from
// the letter ratios the multiplier preserves.
watch(multiplier, restart)

watch(
  () => store.getActiveSuraTab,
  (tab) => {
    if (tab !== "hums") stop()
  },
)

watch(isFullscreen, async () => {
  await new Promise((resolve) => requestAnimationFrame(resolve))
  resizePlate()
})

// Swapping suras while stopped should still show the new first word's mode.
watch(currentWord, showStaticMode)

// A theme switch changes both the tint and the sand colour, so repaint them.
watch(
  () => theme.current.value.dark,
  () => {
    if (!plate) return
    // Force the cached mode to repaint in the new palette.
    fieldKey = ""
    plate.sandColor = canvasRgb(plateRef.value, "--v-theme-on-surface")
    rebuildField()
  },
)

onMounted(async () => {
  resizePlate()
  startPlate()
  window.addEventListener("resize", resizePlate)
  // Letter counts are the source of the frequencies, so make sure they landed.
  await dataStore.getQuranData()
  showStaticMode()
})

onUnmounted(() => {
  stop()
  stopPlate()
  window.removeEventListener("resize", resizePlate)
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
