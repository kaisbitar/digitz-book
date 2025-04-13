<template>
  <div
    v-for="(word, index) in verseWords"
    :key="index"
    class="word ml-0 mr-1"
    :class="[
      hasMatch(word, inputText) ? 'highlight-match' : '',
      currentWord === word ? 'border bg-secondary-highlight' : '',
    ]"
    @click="handleWordClick(word)"
  >
    <span>{{ word }}</span>
  </div>
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"

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
  currentWord: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(["update:currentWord"])

const verseWords = computed(() => props.verse.split(" "))

const hasMatch = (word, input) => {
  console.log(word, input)
  if (!input) return false

  return word.includes(input)
}

const handleWordClick = async (word) => {
  emit("update:currentWord", word)
}
</script>

<style lang="scss">
.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  font-size: 22px;
}
</style>
