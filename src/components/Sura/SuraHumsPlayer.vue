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
    <!-- Distinctive method switch: letters one by one, or the whole word. -->
    <v-btn
      class="hums-mode text-caption font-weight-bold"
      variant="flat"
      size="small"
      color="primary"
      :title="mode === 'letters' ? 'حرف واحد لكل تردد' : 'مجموع الحروف لكل كلمة'"
      @click="$emit('update:mode', mode === 'letters' ? 'words' : 'letters')"
    >
      <v-icon start size="small">
        {{ mode === "letters" ? "mdi-alphabetical" : "mdi-format-letter-case" }}
      </v-icon>
      {{ mode === "letters" ? "حرف" : "كلمة" }}
    </v-btn>
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
        <div class="text-caption text-medium-emphasis mb-1">
          السرعة {{ speed }}x
        </div>
        <v-slider
          :model-value="speed"
          :min="0.25"
          :max="4"
          :step="0.25"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:speed', $event)"
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
          @click="$emit('update:multiplier', item.value)"
        />
      </v-list>
    </v-menu>
    <v-menu location="top" :close-on-content-click="false">
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          icon="mdi-sine-wave"
          variant="text"
          size="small"
          :color="tuneActive ? 'primary' : undefined"
          title="تردد ثابت للمقارنة"
        />
      </template>
      <v-list density="compact" class="pa-3" min-width="260">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-caption text-medium-emphasis">
            تردد ثابت {{ tuneHz || "—" }} هرتز
          </span>
          <v-btn
            :icon="tuneSounding ? 'mdi-stop' : 'mdi-play'"
            variant="text"
            size="small"
            :disabled="!tuneActive"
            :title="tuneSounding ? 'إيقاف' : 'تشغيل'"
            @click="$emit('toggle-tone')"
          />
        </div>
        <v-slider
          :model-value="tuneHz"
          :min="0"
          :max="2000"
          :step="1"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:tuneHz', $event)"
        />
        <v-btn
          v-for="item in tunePresets"
          :key="item.value"
          block
          variant="text"
          size="small"
          :active="item.value === tuneHz"
          @click="$emit('update:tuneHz', item.value)"
        >
          {{ item.title }}
        </v-btn>
      </v-list>
    </v-menu>
    <SuraHumsGrainMenu v-model="grain" />
    <v-menu location="top" :close-on-content-click="false">
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          icon="mdi-tune"
          variant="text"
          size="small"
          title="إعدادات التشغيل"
        />
      </template>
      <v-list density="compact" class="pa-3" min-width="300">
        <div class="text-caption text-medium-emphasis mb-1">
          مدة الحرف {{ letterSeconds.toFixed(2) }} ث
        </div>
        <v-slider
          :model-value="letterSeconds"
          :min="0.05"
          :max="0.5"
          :step="0.01"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:letterSeconds', $event)"
        />
        <div class="text-caption text-medium-emphasis mb-1">
          مدة الكلمة {{ wordSeconds.toFixed(2) }} ث
        </div>
        <v-slider
          :model-value="wordSeconds"
          :min="0.2"
          :max="1.5"
          :step="0.05"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:wordSeconds', $event)"
        />
        <div class="d-flex align-center justify-space-between">
          <v-icon size="small">mdi-volume-high</v-icon>
          <span class="text-caption text-medium-emphasis">
            مستوى الصوت {{ Math.round(volume * 100) }}٪
          </span>
        </div>
        <v-slider
          :model-value="volume"
          :min="0"
          :max="1"
          :step="0.05"
          hide-details
          density="compact"
          color="primary"
          @update:model-value="$emit('update:volume', $event)"
        />
        <div class="text-caption text-medium-emphasis mb-1">
          كلمات في كل نبضة {{ wordsPerPulse }}
        </div>
        <v-slider
          :model-value="wordsPerPulse"
          :min="1"
          :max="6"
          :step="1"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:wordsPerPulse', $event)"
        />
        <div class="text-caption text-medium-emphasis mb-1">
          وقفة بين النبضات {{ phrasePause.toFixed(1) }} ث
        </div>
        <v-slider
          :model-value="phrasePause"
          :min="0.1"
          :max="1"
          :step="0.1"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:phrasePause', $event)"
        />
        <div class="text-caption text-medium-emphasis mb-1">
          وقفة بين الآيات {{ versePause.toFixed(1) }} ث
        </div>
        <v-slider
          :model-value="versePause"
          :min="0.5"
          :max="2"
          :step="0.1"
          hide-details
          density="compact"
          thumb-label
          color="primary"
          @update:model-value="$emit('update:versePause', $event)"
        />
      </v-list>
    </v-menu>
    <v-btn
      :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      variant="text"
      size="small"
      @click="$emit('fullscreen')"
    />
  </div>
</template>

<script setup>
import { MULTIPLIERS, LETTER_DIVISOR } from "@/utils/wordTone"
import SuraHumsGrainMenu from "./SuraHumsGrainMenu.vue"

defineProps({
  isFullscreen: Boolean,
  isPlaying: Boolean,
  isLooping: Boolean,
  index: Number,
  totalWords: Number,
  position: Number,
  total: Number,
  speed: Number,
  multiplier: Number,
  multiplierWarning: String,
  tuneActive: Boolean,
  tuneSounding: Boolean,
  tuneHz: Number,
  volume: Number,
  wordsPerPulse: Number,
  phrasePause: Number,
  versePause: Number,
  letterSeconds: Number,
  wordSeconds: Number,
})

// v-model targets, so the parent keeps ownership of the actual refs.
const speed = defineModel("speed", { type: Number, required: true })
const multiplier = defineModel("multiplier", { type: Number, required: true })
const tuneHz = defineModel("tuneHz", { type: Number, required: true })
const grain = defineModel("grain", { type: Object, required: true })
const mode = defineModel("mode", { type: String, required: true })

defineEmits([
  "play",
  "stop",
  "seek",
  "update:isLooping",
  "update:volume",
  "update:wordsPerPulse",
  "update:phrasePause",
  "update:versePause",
  "update:letterSeconds",
  "update:wordSeconds",
  "toggle-tone",
  "fullscreen",
])

const multipliers = MULTIPLIERS.map((value) => ({ title: `×${value}`, value }))

// Reference tones, so a run is one tap instead of typing a number. The seven
// Solfeggio/chakra tones, plus 432 (the "natural" tuning) and 440 (concert A).
const tunePresets = [396, 417, 432, 440, 528, 639, 741, 852, 963].map((value) => ({
  title: `${value} هرتز`,
  value,
}))

const formatTime = (seconds) => {
  const s = Math.floor(seconds || 0)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
</script>
