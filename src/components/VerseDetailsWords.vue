<template>
  <div
    v-for="(word, index) in verseWords"
    :key="index"
    class="word ml-0 mr-1"
    @click="handleWordClick(index, word)"
  >
    <span v-html="highlight(word, inputText)"></span>
  </div>
</template>

<script setup>
import {
  fetchWordRootData,
  fetchWordMeaningData,
} from "@/utils/dictionaryUtils.js"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { onMounted } from "vue"

const { highlight } = useInputFiltering()

const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
  inputText: {
    type: String,
    required: false,
    default: "",
  },
})
const emit = defineEmits([
  "update:currentMeaning",
  "update:currentWord",
  "update:loading",
])

const store = useStore()

const verseWords = computed(() => props.verse.split(" "))
const storedMeaning = computed(() => ({
  get: (word) => store.getWordMeaning(word),
  has: (word) => !!store.getWordMeaning(word),
}))

const handleWordClick = async (index, word) => {
  // await fetchWordData(verseWords.value[index])
  emit("update:currentWord", word)
}

// const fetchWordData = async (word) => {
//   try {
//     emit("update:loading", true)

//     if (storedMeaning.value.has(word)) {
//       emitWordData(word, storedMeaning.value.get(word))
//       return
//     }

//     const wordRoot = await fetchWordRootData(word)
//     const extractedMeaning = await fetchWordMeaningData(word, wordRoot)

//     store.setWordMeaning(word, extractedMeaning)
//     emitWordData(word, extractedMeaning)
//   } finally {
//     emit("update:loading", false)
//   }
// }

const emitWordData = (word, meaning) => {
  // emit("update:currentMeaning", meaning)
  emit("update:currentWord", word)
}
// watch(verseWords, () => {
//   fetchWordData(verseWords.value[0])
// })

// onMounted(() => {
//   fetchWordData(verseWords.value[0])
// })
</script>

<style lang="scss">
.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  font-size: 22px;
}
</style>
