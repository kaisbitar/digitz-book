<template>
  <div>
    <span class="text-h4 ml-4">{{ word }}</span>
    <AppHeaderMetrics :metrics="counts" />
  </div>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
const { calculateValue } = useCounting()

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  versesCount: {
    type: Number,
    required: true,
  },
  occurrenceCount: {
    type: Number,
    required: true,
  },
})

const counts = computed(() => [
  { value: props.versesCount, label: "آية" },
  { value: props.occurrenceCount, label: "مرة" },
  { value: calculateValue(props.word), label: "مرقوم" },
])

defineEmits(["update:expanded"])
</script>
