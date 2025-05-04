<template>
  <div v-if="selectedField">
    <v-textarea
      v-model="promptTemplate"
      label="Prompt Template"
      hint="Use {value} as a placeholder for the selected field value."
      persistent-hint
      rows="3"
      class="mb-4"
    />
    <div v-if="sampleValues && sampleValues.length">
      <div class="text-subtitle-1 mb-2">Live Preview:</div>
      <v-card variant="outlined" class="pa-4">
        {{ previewPrompt }}
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"

const props = defineProps({
  selectedField: {
    type: String,
    required: true,
  },
  sampleValues: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["update:prompt"])
const promptTemplate = ref("Analyze the {value} and provide its meaning.")

const previewPrompt = computed(() => {
  if (!props.sampleValues.length) return ""
  return promptTemplate.value.replace("{value}", props.sampleValues[0])
})

// Emit initial value
onMounted(() => {
  emit("update:prompt", promptTemplate.value)
})

// Watch for changes
watch(promptTemplate, (val) => {
  emit("update:prompt", val)
})

// Also watch for selectedField changes to re-emit the prompt
watch(
  () => props.selectedField,
  () => {
    emit("update:prompt", promptTemplate.value)
  },
  { immediate: true }
)
</script>
