<template>
  <div
    v-for="(word, index) in verseWords"
    :key="index"
    class="word ml-0 mr-1"
    :class="currentWord === word ? 'border bg-secondary-highlight' : ''"
    @click="handleWordClick(word)"
  >
    <span v-html="marked(word)"></span>
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

const marked = (word) => {
  const input = props.inputText?.trim()
  if (!input) return word

  const tokens = input.split(/\s+/)
  for (const token of tokens) {
    const result = highlight(word, token)
    if (result && result !== word) return result
  }
  return word
}

const handleWordClick = (word) => {
  emit("update:currentWord", word)
}
</script>

<style lang="scss">
.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  font-size: 1.09rem;
}
</style>
