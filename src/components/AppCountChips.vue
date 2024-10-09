<template>
  <v-chip
    v-if="versesCount >= 0"
    size="x-small"
    variant="outlined"
    class="ml-1"
    :class="versesCount <= 0 ? 'text-red' : 'verses-count'"
  >
    {{ versesCount }} {{ labels?.verse }}
  </v-chip>
  <v-chip
    v-if="wordCount >= 0"
    size="x-small"
    variant="outlined"
    class="ml-1"
    :class="wordCount <= 0 ? 'text-red' : 'word-count'"
  >
    {{ wordCount }} {{ labels?.word }}
  </v-chip>
  <v-chip
    v-if="letterCount"
    class="letter-count ml-1"
    size="x-small"
    variant="outlined"
    :class="letterCount <= 0 ? 'text-red' : 'letter-count'"
  >
    {{ letterCount }} {{ labels?.letter }}
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
  labels: {
    type: Object,
  },
})
</script>

<style>
.v-chip__content {
  font-size: 14px !important;
}
</style>
