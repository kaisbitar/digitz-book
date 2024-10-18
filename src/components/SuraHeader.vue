<template>
  <div class="d-flex mb-4">
    <span class="text-h6 text-sm-h5 font-weight-bold mb-2 mb-md-0 ml-md-4">{{
      title
    }}</span>
    <AppMetaData :metaData="suraMetaData" class="" />
  </div>
</template>

<script setup>
import AppMetaData from "./AppMetaData.vue"

const props = defineProps({
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
})

const suraMetaData = computed(() => ({
  آية: { value: props.numberOfVerses, color: "word-count" },
  كلمة: { value: props.numberOfWords, color: "verse-count" },
  حرف: { value: props.numberOfLetters, color: "letter-count" },
}))
</script>

<style scoped></style>
