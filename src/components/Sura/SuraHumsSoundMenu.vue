<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-caption text-medium-emphasis">ضبط الصوت</span>
      <v-btn variant="text" size="small" @click="reset">افتراضي</v-btn>
    </div>
    <div class="d-flex align-center justify-space-between">
      <v-icon size="small">mdi-volume-high</v-icon>
      <span class="text-caption text-medium-emphasis">
        مستوى الصوت {{ Math.round(volume * 100) }}٪
      </span>
    </div>
    <v-slider
      v-model="volume"
      :min="0"
      :max="1"
      :step="0.05"
      hide-details
      density="compact"
      color="primary"
    />
    <div class="text-caption text-medium-emphasis mb-1">
      الموجة {{ waveLabels[tune.wave] || tune.wave }}
    </div>
    <v-btn-toggle
      :model-value="tune.wave"
      density="compact"
      variant="outlined"
      divided
      class="mb-3"
      @update:model-value="tune.wave = $event"
    >
      <v-btn v-for="w in waves" :key="w" :value="w" size="small">
        {{ waveLabels[w] }}
      </v-btn>
    </v-btn-toggle>
    <v-slider
      v-for="item in AUDIO_FIELDS"
      :key="item.key"
      v-model="tune[item.key]"
      :label="`${item.label} ${tune[item.key].toFixed(item.decimals)}`"
      :min="item.min"
      :max="item.max"
      :step="item.step"
      hide-details
      density="compact"
      color="primary"
    />
  </div>
</template>

<script setup>
import { AUDIO_DEFAULTS, AUDIO_FIELDS } from "@/hooks/useHumsAudio"

// The live sound settings, owned by useHumsAudio and passed straight through.
// A prop, not a model: the refs live in the hook, so the menu only mutates their
// values and never replaces the object.
const props = defineProps({ tune: { type: Object, required: true } })
const tune = props.tune
const volume = defineModel("volume", { type: Number, required: true })

// Four waveforms, labelled in Arabic. Square/saw are deliberately harsh, so a
// run that wants bite can have it.
const waves = ["sine", "triangle", "square", "sawtooth"]
const waveLabels = { sine: "جيبية", triangle: "مثلثية", square: "مربعة", sawtooth: "منشارية" }

const reset = () => Object.assign(tune, AUDIO_DEFAULTS)
</script>
