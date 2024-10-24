<template>
  <div class="d-flex mb-4">
    <span class="text-h4 ml-4">{{ title }}</span>
    <AppMetaData :metaData="suraMetaData" v-if="!isHidden" />
  </div>
</template>

<script setup>
import AppMetaData from "./AppMetaData.vue"

const props = defineProps({
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
  isHidden: Boolean,
})

const suraMetaData = computed(() => ({
  آية: { value: props.numberOfVerses },
  كلمة: { value: props.numberOfWords },
  حرف: { value: props.numberOfLetters },
}))
</script>

<style scoped></style>
