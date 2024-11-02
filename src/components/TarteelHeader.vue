<template>
  <div class="d-flex mb-2">
    <span class="text-h4 ml-4">{{ word }}</span>

    <span class="text-h4 mr-3 count-key-item">
      {{ versesCount }}
      <span class="text-caption mr-n1 count-key-item">آية</span>
    </span>

    <span class="text-h4 mr-3 count-key-item">
      {{ occurrenceCount }}
      <span class="text-caption mr-n1 count-key-item">مرة</span>
    </span>

    <v-btn
      icon="mdi-chevron-down"
      elevation="0"
      class="mr-auto"
      @click="$emit('update:expanded', !expanded)"
    >
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
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
  expanded: {
    type: Boolean,
    required: true,
  },
})

defineEmits(["update:expanded"])
</script>
