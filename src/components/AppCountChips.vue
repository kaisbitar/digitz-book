<template>
  <v-chip
    v-if="versesCount >= 0"
    size="x-small"
    variant="outlined"
    class="ml-1"
    :class="versesCount <= 0 ? 'text-red' : 'verses-count'"
  >
    {{ versesCount }} آية
  </v-chip>
  <v-chip
    v-if="wordCount >= 0"
    size="x-small"
    variant="outlined"
    class="ml-1"
    :class="wordCount <= 0 ? 'text-red' : 'word-count'"
  >
    <span class="ml-1">{{ wordCount }} </span>
    <span v-if="isSura"> كلمة</span>
    <span v-else> مرة </span>
  </v-chip>
  <v-chip
    v-if="letterCount"
    class="letter-count ml-1"
    size="x-small"
    variant="outlined"
    :class="letterCount <= 0 ? 'text-red' : 'letter-count'"
  >
    {{ letterCount }} حرف
  </v-chip>
</template>

<script setup>
const props = defineProps({
  letterCount: {
    type: Number,
  },
  wordCount: {
    type: Number,
  },
  versesCount: {
    type: Number,
  },
  isSura: {
    type: Boolean,
  },
  isVerse: {
    type: Boolean,
  },
})
</script>

<style>
.v-chip__content {
  font-size: 14px !important;
}
</style>
