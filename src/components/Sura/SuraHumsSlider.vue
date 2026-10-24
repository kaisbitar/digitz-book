<template>
  <!-- One labelled slider, so every setting reads the same and adding one is a
       single element instead of a caption plus a slider. -->
  <div class="text-caption text-medium-emphasis mb-1">
    {{ label }} {{ valueText }}
  </div>
  <v-slider
    :model-value="log ? toPos(modelValue) : modelValue"
    :min="log ? 0 : min"
    :max="log ? STEPS : max"
    :step="log ? 1 : step"
    hide-details
    density="compact"
    color="primary"
    @update:model-value="onInput"
  />
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, required: true },
  decimals: { type: Number, default: 1 },
  suffix: { type: String, default: " ث" },
  // For sliders whose value is an index into a list of real values.
  display: { type: String, default: "" },
  // Hearing is logarithmic, so a linear frequency slider puts every useful
  // setting in its first pixels. `log` walks the range by octaves instead.
  log: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue"])

// Positions are integers, so a log slider keeps its own resolution.
const STEPS = 1000
const ratio = computed(() => Math.log(props.max / props.min))
const toPos = (v) => Math.round(
  (Math.log(Math.min(props.max, Math.max(props.min, v)) / props.min) / ratio.value) * STEPS,
)
const fromPos = (pos) => {
  const raw = props.min * Math.exp((pos / STEPS) * ratio.value)
  return Math.min(props.max, Math.max(props.min, Math.round(raw / props.step) * props.step))
}
const onInput = (v) => emit("update:modelValue", props.log ? fromPos(v) : v)

const valueText = computed(
  () => props.display || `${props.modelValue.toFixed(props.decimals)}${props.suffix}`,
)
</script>
