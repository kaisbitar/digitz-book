<template>
  <!-- The timbre: level, waveform, filter and the two effect sends. Every
       control is the same slider/caption pair as the speed tab, so the tabs
       read as one panel. -->
  <div class="d-flex align-center justify-space-between mb-2">
    <span class="text-caption text-medium-emphasis">ضبط الصوت</span>
    <v-btn variant="text" size="small" @click="reset">افتراضي</v-btn>
  </div>
  <SuraHumsSlider
    v-model="volume"
    label="مستوى الصوت"
    :min="0"
    :max="1"
    :step="0.05"
    :display="`${Math.round(volume * 100)}٪`"
  />
  <div class="text-caption text-medium-emphasis mb-1">
    الموجة {{ waveLabels[tune.wave] || tune.wave }}
  </div>
  <v-btn-toggle
    :model-value="tune.wave"
    density="compact"
    variant="outlined"
    divided
    mandatory
    class="mb-3"
    @update:model-value="tune.wave = $event"
  >
    <v-btn v-for="w in waves" :key="w" :value="w" size="small">
      {{ waveLabels[w] }}
    </v-btn>
  </v-btn-toggle>
  <SuraHumsSlider
    v-for="item in AUDIO_FIELDS"
    :key="item.key"
    v-model="tune[item.key]"
    :label="item.label"
    :min="item.min"
    :max="item.max"
    :step="item.step"
    :decimals="item.decimals"
    :log="!!item.log"
    suffix=""
  />
</template>

<script setup>
import { AUDIO_DEFAULTS, AUDIO_FIELDS } from "@/hooks/useHumsAudio"
import SuraHumsSlider from "./SuraHumsSlider.vue"

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
