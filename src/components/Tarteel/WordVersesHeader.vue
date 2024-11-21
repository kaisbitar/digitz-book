<template>
  <div class="d-flex mb-2">
    <span class="text-h4 ml-4">{{ word }}</span>

    <template v-for="(item, index) in counts" :key="index">
      <div class="text-h4">
        <span class="count-key-item">{{ item.count }}</span>
        <span class="text-caption ml-3 mr-1">{{ item.label }}</span>
      </div>
    </template>
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
  { count: props.versesCount, label: "آية" },
  { count: props.occurrenceCount, label: "مرة" },
  { count: calculateValue(props.word), label: "مرقوم" },
])

defineEmits(["update:expanded"])
</script>
