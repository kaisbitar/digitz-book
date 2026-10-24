<template>
  <div class="hums-player d-flex flex-row-reverse align-center ga-2 px-2 py-1">
    <v-btn
      :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
      variant="text"
      size="large"
      :disabled="!totalWords"
      @click="isPlaying ? $emit('stop') : $emit('play')"
    />
    <span class="hums-time text-caption">{{ formatTime(position) }}</span>
    <!-- The app is RTL, but a player scrubber reads left to right. -->
    <v-locale-provider :rtl="false" class="flex-grow-1">
      <v-slider
        :model-value="index"
        :min="0"
        :max="Math.max(totalWords - 1, 0)"
        :step="1"
        hide-details
        density="compact"
        @update:model-value="$emit('seek', $event)"
      />
    </v-locale-provider>
    <span class="hums-time text-caption">{{ formatTime(total) }}</span>
    <v-btn
      icon="mdi-repeat"
      variant="text"
      size="small"
      :color="isLooping ? 'primary' : undefined"
      :title="isLooping ? 'تكرار: مفعّل' : 'تكرار: متوقف'"
      @click="$emit('update:isLooping', !isLooping)"
    />
    <v-btn
      icon="mdi-download"
      variant="text"
      size="small"
      :loading="rendering"
      :disabled="!totalWords || rendering || total > WAV_MAX_SECONDS"
      :title="total > WAV_MAX_SECONDS ? 'أطول من ١٥ دقيقة' : 'تنزيل'"
      @click="$emit('download')"
    />
    <!-- Method picker: letters one by one, words, or whole verses. -->
    <v-menu location="top">
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          class="hums-mode text-caption font-weight-bold"
          variant="flat"
          size="small"
          color="primary"
          :title="modeTitle"
        >
          <v-icon start size="small">{{ modeIcon }}</v-icon>
          {{ modeLabel }}
          <v-icon end size="small">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" min-width="180">
        <v-list-item
          v-for="item in modeItems"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :active="item.value === mode"
          @click="mode = item.value"
        />
      </v-list>
    </v-menu>
    <v-chip
      size="small"
      variant="text"
      class="hums-hint"
      :color="multiplierWarning ? 'warning' : undefined"
    >
      {{ multiplierWarning || `تردد الحرف ÷ ${LETTER_DIVISOR}` }}
    </v-chip>
    <SuraHumsGrainMenu v-model="grain" :defaults="grainDefaults" />
    <SuraHumsSettingsMenu
      v-model:volume="volume"
      v-model:tone-on="toneOn"
      :timing="timing"
      :mode="mode"
      :sound-tune="soundTune"
    />
    <v-btn
      :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      variant="text"
      size="small"
      @click="$emit('fullscreen')"
    />
  </div>
</template>

<script setup>
import { computed } from "vue"
import { LETTER_DIVISOR } from "@/utils/wordTone"
import { WAV_MAX_SECONDS } from "@/hooks/useHumsAudio"
import SuraHumsGrainMenu from "./SuraHumsGrainMenu.vue"
import SuraHumsSettingsMenu from "./SuraHumsSettingsMenu.vue"

defineProps({
  isFullscreen: Boolean,
  isPlaying: Boolean,
  isLooping: Boolean,
  index: Number,
  totalWords: Number,
  position: Number,
  total: Number,
  multiplierWarning: String,
  grainDefaults: Object,
  soundTune: Object,
  rendering: Boolean,
  // The live settings object owned by SuraHums; the settings menu binds to it.
  timing: { type: Object, required: true },
})

// v-model targets, so the parent keeps ownership of the actual refs.
const grain = defineModel("grain", { type: Object, required: true })
const mode = defineModel("mode", { type: String, required: true })
const volume = defineModel("volume", { type: Number, required: true })
const toneOn = defineModel("toneOn", { type: Boolean, required: true })

defineEmits(["play", "stop", "seek", "download", "update:isLooping", "fullscreen"])

// The three methods, in the order the menu lists them. Icons and titles stay
// with the values so the button and the list cannot disagree.
const modeItems = [
  { value: "letters", label: "حرف", icon: "mdi-alphabetical", title: "حرف واحد لكل تردد" },
  { value: "words", label: "كلمة", icon: "mdi-format-letter-case", title: "مجموع الحروف لكل كلمة" },
  { value: "verses", label: "آية", icon: "mdi-book-open-variant", title: "مجموع كل حروف الآية" },
]
const modeCurrent = computed(() => modeItems.find((item) => item.value === mode.value) || modeItems[0])
const modeLabel = computed(() => modeCurrent.value.label)
const modeIcon = computed(() => modeCurrent.value.icon)
const modeTitle = computed(() => modeCurrent.value.title)

const formatTime = (seconds) => {
  const s = Math.floor(seconds || 0)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
</script>
