<template>
  <div v-for="(word, index) in verseWords" :key="index" class="d-inline-block">
    <v-tooltip bottom>
      <template v-slot:activator="{ props }">
        <span
          v-bind="props"
          @mouseover="displayMeaning(word)"
          class="word-tooltip ml-2"
        >
          {{ word }}
        </span>
      </template>
      <template
        v-if="meanings[word]"
        v-for="(meaning, i) in meanings[word]"
        :key="i"
      >
        <v-card class="pa-4 mb-1 elevation-2">
          <v-card-title
            class="text-h6"
            v-html="highlight(meaning.word, word)"
          />
          <v-card-text>
            <div class="meaning mb-2">
              <strong>المعنى: </strong>
              <span v-html="highlight(meaning.meaning, word)" />
            </div>
            <div class="dictionary-source">
              <em>المصدر: {{ meaning.dictionary }}</em>
            </div>
          </v-card-text>
        </v-card>
      </template>
      <template v-else>
        <v-progress-circular indeterminate></v-progress-circular
      ></template>
    </v-tooltip>
  </div>
</template>

<script setup>
import { fetchWordMeaning } from "@/api/api.js"
import { ref, reactive, computed } from "vue"
import { extractFromDictionnary } from "@/utils/dictionaryUtils.js"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
})
const meanings = reactive({})
const dialog = ref(false)
const currentWord = ref("")

const verseWords = computed(() => props.verse.split(" "))

const displayMeaning = async (word) => {
  currentWord.value = word
  dialog.value = true
  const appApi = import.meta.env.VITE_APP_API_URL

  if (!meanings[word]) {
    const response = await fetchWordMeaning(appApi, word)
    meanings[word] = extractFromDictionnary(response[0], currentWord)
    console.log(meanings[word])
    return meanings[word]
  }
}
</script>
<style lang="scss"></style>
