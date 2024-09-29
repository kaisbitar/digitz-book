<template>
  <v-chip
    size="x-small"
    variant="outlined"
    :color="versesCount > 0 ? 'blue' : 'red'"
  >
    {{ versesCount }} آية
  </v-chip>
  <v-chip
    class="mr-2"
    :color="versesCount > 0 ? 'green' : 'red'"
    variant="outlined"
    size="x-small"
  >
    <span>{{ wordCount }} </span>
    <span v-if="sura">كلمة</span>
    <span v-else>مرة</span>
  </v-chip>
</template>

<script setup>
const props = defineProps({
  wordCount: {
    type: Number,
  },
  versesCount: {
    type: Number,
  },
  sura: {
    type: Boolean,
  },
})
</script>

<style>
.v-chip__content {
  font-size: 14px !important;
}
</style>
