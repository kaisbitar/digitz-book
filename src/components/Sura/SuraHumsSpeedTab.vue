<template>
  <!-- The clock and the pitch. Only the active method's timings are shown, so
       letter mode is not bound by a word time and word mode by a word stop. -->
  <SuraHumsSlider
    v-model="timing.speed"
    label="السرعة"
    :min="range.speed.min"
    :max="range.speed.max"
    :step="range.speed.step"
    :decimals="2"
    suffix="x"
  />
  <SuraHumsSlider
    v-model="multiplierIndex"
    label="تردد الحرف"
    :display="`×${timing.multiplier}`"
    :min="0"
    :max="MULTIPLIERS.length - 1"
    :step="1"
  />
  <div class="d-flex align-center justify-space-between mb-1">
    <v-switch
      v-model="toneOn"
      density="compact"
      hide-details
      color="primary"
      :disabled="!timing.tuneHz"
      :label="toneOn ? 'تردد ثابت' : 'صوت الآية'"
      class="flex-grow-0"
    />
    <span class="text-caption text-medium-emphasis">
      {{ timing.tuneHz || "—" }} هرتز
    </span>
  </div>
  <SuraHumsSlider
    v-model="timing.tuneHz"
    label="التردد"
    :min="0"
    :max="2000"
    :step="1"
    :decimals="0"
    suffix=" هرتز"
  />
  <div class="d-flex flex-wrap ga-1 mb-2">
    <v-btn
      v-for="hz in TUNE_PRESETS"
      :key="hz"
      variant="text"
      size="x-small"
      :active="hz === timing.tuneHz"
      @click="timing.tuneHz = hz"
    >
      {{ hz }}
    </v-btn>
  </div>
  <SuraHumsSlider
    v-if="mode === 'words'"
    v-model="timing.wordSeconds"
    label="مدة الكلمة"
    :min="0.1"
    :max="3"
    :step="0.05"
    :decimals="2"
  />
  <SuraHumsSlider
    v-else
    v-model="timing.letterSeconds"
    label="مدة الحرف"
    :min="range.letterSeconds.min"
    :max="range.letterSeconds.max"
    :step="range.letterSeconds.step"
    :decimals="2"
  />
  <SuraHumsSlider
    v-if="mode === 'letters'"
    v-model="timing.wordStop"
    label="وقفة بين الكلمات"
    :min="0"
    :max="5"
    :step="0.1"
  />
  <SuraHumsSlider
    v-if="mode === 'words'"
    v-model="timing.wordsPerPulse"
    label="كلمات في كل نبضة"
    :min="1"
    :max="20"
    :step="1"
    :decimals="0"
    suffix=""
  />
  <SuraHumsSlider
    v-if="mode === 'words'"
    v-model="timing.phrasePause"
    label="وقفة بين النبضات"
    :min="0.1"
    :max="5"
    :step="0.1"
  />
  <SuraHumsSlider
    v-if="mode === 'verses'"
    v-model="timing.verseSeconds"
    label="مدة الآية"
    :min="0.5"
    :max="15"
    :step="0.5"
  />
  <SuraHumsSlider
    v-model="timing.versePause"
    label="وقفة بين الآيات"
    :min="range.versePause.min"
    :max="range.versePause.max"
    :step="range.versePause.step"
  />
</template>

<script setup>
import { computed } from "vue"
import { MULTIPLIERS } from "@/utils/wordTone"
import SuraHumsSlider from "./SuraHumsSlider.vue"

const props = defineProps({
  // The player's own settings object; reactive() unwraps its refs, so v-model
  // here writes the live values.
  timing: { type: Object, required: true },
  mode: { type: String, required: true },
})

const toneOn = defineModel("toneOn", { type: Boolean, required: true })

// The reference tones, so trying one is a tap rather than typing a number.
const TUNE_PRESETS = [396, 417, 432, 440, 528, 639, 741, 852, 963]

// A multiplier is a rung on a ladder, so the slider walks the index and the
// ladder supplies the value.
const multiplierIndex = computed({
  get: () => Math.max(0, MULTIPLIERS.indexOf(props.timing.multiplier)),
  set: (index) => (props.timing.multiplier = MULTIPLIERS[index]),
})

// Slider travel per method: a verse is one held tone, so its clock and pause
// run far wider than a letter's.
const RANGES = {
  letters: {
    speed: { min: 0.25, max: 10, step: 0.25 },
    letterSeconds: { min: 0.01, max: 2, step: 0.01 },
    versePause: { min: 0, max: 5, step: 0.1 },
  },
  words: {
    speed: { min: 0.25, max: 12, step: 0.25 },
    letterSeconds: { min: 0.05, max: 0.5, step: 0.01 },
    versePause: { min: 0.5, max: 2, step: 0.1 },
  },
  verses: {
    speed: { min: 0.25, max: 12, step: 0.25 },
    letterSeconds: { min: 0.05, max: 1, step: 0.01 },
    versePause: { min: 0.5, max: 2, step: 0.1 },
  },
}
const range = computed(() => RANGES[props.mode] || RANGES.letters)
</script>
