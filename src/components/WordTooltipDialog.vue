<template>
  <div class="tooltip-meaning" v-if="currentMeaning.length > 0">
    <div class="d-flex justify-space-between">
      <h4>{{ word }}</h4>
      <v-btn size="small" @click="openTarteel(word)">ترتيل</v-btn>
    </div>
    <p v-for="(meaning, index) in currentMeaning.slice(0, 3)" :key="index">
      <v-divider class="my-2"></v-divider>
      <strong>{{ meaning.word }}: </strong>
      {{ meaning.meaning }}<br />
      <em>المصدر: {{ meaning.dictionary }}</em>
    </p>
    <v-divider class="my-2"></v-divider>
    <v-btn size="small" @click="openDialog">المزيد..</v-btn>
  </div>
  <v-progress-circular
    v-if="loading"
    indeterminate
    color="primary"
    size="20"
  ></v-progress-circular
  ><AppDialog
    :modelValue="showWordMeaningDialog"
    @update:modelValue="showWordMeaningDialog = false"
    :closingBarData="closingBarData"
  >
    <WordMeaning :word="currentWord" :meanings="meanings[currentWord] || []" />
  </AppDialog>
</template>

<script setup>
const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  currentWord: {
    type: String,
    required: true,
  },
  currentMeaning: {
    type: Array,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  meanings: {
    type: Object,
    required: true,
  },
  closingBarData: {
    type: Object,
    required: true,
  },
})

const showWordMeaningDialog = ref(false)

const openDialog = () => {
  showWordMeaningDialog.value = true
}

const openTarteel = (word) => {
  //   window.open(`https://tarteel.ai/search?q=${word}`, "_blank")
}
</script>

<style scoped>
.tooltip-meaning {
  max-width: 482px;
  position: relative !important;
  pointer-events: auto;
}
</style>
