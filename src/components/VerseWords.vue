<template>
  <v-btn
    v-for="(word, index) in verseWords"
    :key="index"
    v-bind="props"
    color="blue"
    @click="findMeaning(word)"
    class="ml-1 mb-1 d-inline-block"
    variant="tonal"
  >
    {{ word }}
  </v-btn>
  <AppDialog
    :modelValue="showWordMeaning"
    @update:modelValue="showWordMeaning = false"
    :closingBarData="closingBarData"
  >
    <WordMeaning :word="currentWord" :meanings="meanings[currentWord] || []" />
  </AppDialog>
</template>

<script setup>
import { fetchWordMeaning, fetchWordRoot } from "@/api/api.js"
import { ref, reactive, computed } from "vue"
import { extractFromDictionnary } from "@/utils/dictionaryUtils.js"
import WordMeaning from "./WordMeaning.vue"

const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
})
const meanings = reactive({})
const currentWord = ref("")
const showWordMeaning = ref(false)

const closingBarData = computed(() => ({
  inputText: currentWord,
}))

const verseWords = computed(() => props.verse.split(" "))

const findMeaning = async (word) => {
  currentWord.value = word
  const appApi = import.meta.env.VITE_APP_API_URL
  const wordRootsApi = import.meta.env.VITE_WORD_ROOTS_API_URL
  const wordRoot = await fetchWordRoot(wordRootsApi, word)

  if (!meanings[word]) {
    const response = await fetchWordMeaning(appApi, wordRoot.words[0].root)
    meanings[word] = extractFromDictionnary(response[0], wordRoot.words[0].root)
  }
  showWordMeaning.value = true
  return meanings[word]
}
</script>
<style lang="scss"></style>
