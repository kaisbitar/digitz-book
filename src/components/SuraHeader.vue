<template>
  <div class="d-flex align-center mb-4">
    <span class="text-sm-h5 text-xs-h5 font-weight-bold ml-2">{{ title }}</span>
    <AppCountChips
      :wordCount="numberOfWords"
      :versesCount="numberOfVerses"
      :letterCount="numberOfLetters"
      :labels="{ word: 'كلمة', verse: 'آية', letter: 'حرف' }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
})
</script>

<style scoped>
.sura-tabs {
  max-width: 100%;
}
</style>
