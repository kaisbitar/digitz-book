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
        @click="toggleFullscreen"
      />
      <!-- The word sits on the plate, not below it, so the sand gets the whole
           height. The panel is translucent, so the figure glows through it. -->
      <div class="hums-word text-center px-2">
        <div class="text-h5">{{ currentWord?.text || "—" }}</div>        <div class="hums-notes d-flex justify-center flex-wrap ga-1 mt-1">
          <v-chip
            v-for="(note, index) in currentNotes"
            :key="index"
            size="small"
            :variant="index === activeNote ? 'flat' : 'tonal'"
            :color="index === activeNote ? 'primary' : undefined"
          >
            {{ note.letter }} {{ note.hz }}
          </v-chip>
        </div>
        <div class="text-caption text-medium-emphasis mt-1">
          <template v-if="currentWord">
            آية {{ currentWord.verseIndex }} ·
            {{ currentWord.notes.length }} حرف
          </template>
        </div>
      </div>
    </div>

    <SuraHumsPlayer
      v-model:speed="speed"
      v-model:multiplier="multiplier"
      v-model:tuneHz="tuneHz"
      v-model:grain="grain"
      :is-playing="isPlaying"
      :is-looping="isLooping"
      :is-fullscreen="isFullscreen"
      :index="currentIndex"
      :total-words="timeline.length"
      :position="position"
      :total="total"
      :multiplier-warning="multiplierWarning"
      :tune-active="tuneActive"
      :tune-sounding="tuneSounding"
      @play="play"
      @stop="stop"
      @seek="seek"
      @update:is-looping="isLooping = $event"
      @toggle-tone="toggleTone"
      @fullscreen="toggleFullscreen"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useTheme } from "vuetify"
import {
  AUDIBLE_MAX_HZ,
  AUDIBLE_MIN_HZ,
  toneForLetter,
} from "@/utils/wordTone"
import { useDataStore } from "@/stores/dataStore"
import { useStore } from "@/stores/appStore"
import { FIGURE_HOLD_MS } from "@/utils/cymatics"
import { useCymatics } from "@/hooks/useCymatics"
import { useHumsAudio } from "@/hooks/useHumsAudio"
import { useHumsTimeline } from "@/hooks/useHumsTimeline"
import SuraHumsPlayer from "./SuraHumsPlayer.vue"

const VERSE_PAUSE = 0.6
const LETTER_SECONDS = 0.14

const props = defineProps({
  verses: Array,
})

const dataStore = useDataStore()
const store = useStore()
const theme = useTheme()
const plateRef = ref(null)

const currentIndex = ref(0)
const isPlaying = ref(false)
const isLooping = ref(false)
const isFullscreen = ref(false)
// Kept in the form the UI shows: 1 is the faithful speed, letters at 140ms.
// 0.25 is what the UI opens on: it is the fastest speed at which the plate can
// still show one figure per letter (see FIGURE_HOLD_MS), so sound and shape stay
// in step. Above it the plate runs on a slower clock than the audio.
const speed = ref(0.25)
const multiplier = ref(0.1)
const tuneHz = ref(0)
let timer = null

// Each letter plays its own Quran-wide frequency, scaled by the multiplier.
const letterCounts = computed(() => dataStore.getQuranLetterCounts)
const letterHz = (letter) =>
  toneForLetter(letter, letterCounts.value, multiplier.value)

// Sets outside the audible band go quiet instead of erroring, so warn about them.
const multiplierWarning = computed(() => {
  const hz = Object.keys(letterCounts.value || {}).map(letterHz)
  if (!hz.length) return ""
  if (Math.min(...hz) < AUDIBLE_MIN_HZ) return "أخفض من مدى السمع"
  if (Math.max(...hz) > AUDIBLE_MAX_HZ) return "أعلى من مدى السمع"
  return ""
})

const { timeline } = useHumsTimeline(
  computed(() => props.verses),
  speed,
  LETTER_SECONDS,
  VERSE_PAUSE,
)
const { tuneSounding, play: playNotes, playTone, silence, stopTone, dispose } =
  useHumsAudio()
const cym = useCymatics(plateRef, computed(() => LETTER_SECONDS / speed.value))
// The physics values are owned by the canvas hook; the settings menu binds to
// this same object, so a slider moves the sand directly.
const grain = cym.tune
// Lifted to a top-level binding: a ref reached through the cym object is not
// unwrapped by the template, so comparing against it silently never matched.
const activeNote = cym.activeNote

// Sound and plate share one clock, so a letter strikes exactly when its figure
// retunes.
const stepSeconds = computed(() => LETTER_SECONDS / speed.value)
const tuneActive = computed(() => tuneHz.value > 0)

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

const step = () => {
  const index = currentIndex.value
  const word = timeline.value[index]
  if (!word) return stop()
  playNotes(word.notes, letterHz, stepSeconds.value)
  // The audio keeps its fast per-letter clock, but the plate moves on a slower
  // one: a figure needs about half a second to form, so retuning on every letter
  // left it permanently mid-transition and no shape ever appeared.
  cym.startDrive(word.notes, Math.max(FIGURE_HOLD_MS, stepSeconds.value * 1000))
  // The tick only advances the index; the watch below starts the next word, so
  // a scrub and the timeline share one path.
  timer = setTimeout(() => {
    if (!isPlaying.value) return
    if (index < timeline.value.length - 1) return currentIndex.value++
    if (isLooping.value) return (currentIndex.value = 0)
    stop()
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
  silence()
  cym.clearDrive()
  cym.showStatic(currentWord.value?.notes)
}

// Scrubbing and the timer share one path: both move the index, and this watch
// starts the word at whatever index was landed on. Speed and multiplier changes
// land here too — they rebuild the timeline, so the sounding word must restart
// at the new pitch and the new length.
const restart = () => {
  if (!isPlaying.value) return
  clearTimeout(timer)
  silence()
  step()
}

watch(currentIndex, restart)

const seek = (index) => {
  currentIndex.value = index
}

const toggleTone = () => {
  if (tuneSounding.value) stopTone()
  else playTone(tuneHz.value)
}

// Real device fullscreen (like YouTube), not just a big CSS box: ask the browser
// to fullscreen the stage. The fullscreenchange listener keeps the flag and the
// button icon in step when the user exits with Esc or the system gesture.
const toggleFullscreen = () => {
  if (document.fullscreenElement) return document.exitFullscreen()
  // Some browsers reject on certain elements; ignore it and stay windowed.
  plateRef.value?.closest(".hums-stage")?.requestFullscreen()?.catch(() => {})
}

watch(timeline, (slots) => {
  const clamped = Math.max(slots.length - 1, 0)
  if (currentIndex.value > clamped) return (currentIndex.value = clamped)
  restart()
})
// The multiplier changes pitch only, so the timeline stays put and this watch
// is what restarts the sound.
watch(multiplier, restart)

// Swapping suras while stopped should still show the new first word's figure.
watch(currentWord, () => cym.showStatic(currentWord.value?.notes))

watch(tuneHz, (hz) => {
  if (hz > 0) {
    playTone(hz)
    cym.setToneHz(hz)
    return
  }
  stopTone()
  // Drop the stale tone figure, then hand the plate back to the idle word.
  cym.setToneHz(0)
  cym.clearDrive()
  cym.showStatic(currentWord.value?.notes)
})

watch(
  () => store.getActiveSuraTab,
  (tab) => {
    if (tab === "hums") return
    stop()
    stopTone()
  },
)

watch(isFullscreen, async () => {
  await new Promise((resolve) => requestAnimationFrame(resolve))
  cym.resize()
})

// The browser is the source of truth for fullscreen: Esc or a system gesture
// must update the flag, the button icon, and the plate size.
const onFullscreenChange = () => (isFullscreen.value = !!document.fullscreenElement)
document.addEventListener("fullscreenchange", onFullscreenChange)

// A theme switch changes both the tint and the sand colour, so repaint them.
watch(() => theme.current.value.dark, cym.clear)

onMounted(async () => {
  cym.resize()
  cym.setCounts(letterCounts.value)
  cym.start()
  // Letter counts are the source of the frequencies, so make sure they landed.
  await dataStore.getQuranData()
  cym.setCounts(dataStore.getQuranLetterCounts)
  cym.showStatic(currentWord.value?.notes)
})

onUnmounted(() => {
  stop()
  stopTone()
  dispose()
  document.removeEventListener("fullscreenchange", onFullscreenChange)
  if (document.fullscreenElement) document.exitFullscreen()
})
</script>

<style scoped>
.hums-stage {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hums-fullscreen,
.hums-stage:fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2400;
  height: 100dvh;
  width: 100vw;
  background: black;
}

.hums-plate {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  /* Always black, so the plate corners match the always-black canvas. */
  background: black;
}

.hums-exit {
  position: absolute;
  top: 8px;
  inset-inline-start: 8px;
}

.hums-word {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  /* A translucent scrim, so the figure glows through the text behind it. */
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  max-height: 40%;
  overflow-y: auto;
  /* The plate is always black, so the overlay text is always light, whatever
     the app theme. */
  color: white;
}

.hums-word .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.7) !important;
}

.hums-player {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.hums-notes {
  min-height: 28px;
}

.hums-time {
  min-width: 3px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.hums-multiplier {
  min-width: 2px;
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
