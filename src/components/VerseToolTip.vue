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
      <span v-if="meanings[word]">
        <span
          v-for="(meaning, i) in meanings[word]"
          :key="i"
          v-html="meaning"
        ></span>
      </span>
      <span v-else>
        <v-progress-circular indeterminate></v-progress-circular
      ></span>
    </v-tooltip>
  </div>
</template>

<script setup>
import { fetchWordMeaning } from "../api/api.js"

const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
})
const meanings = reactive({})

const verseWords = computed(() => props.verse.split(" "))

const displayMeaning = async (word) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  if (!meanings[word]) {
    const suffixes = [
      "ة",
      "ون",
      "ين",
      "ات",
      "ي",
      "ا",
      "ي",
      "ت",
      "ون",
      "ين",
      "ات",
      "ي",
      "اء",
      "ي",
      "ات",
      "ي",
      "ين",
      "ات",
      "ي",
      "ة",
      "ي",
      "ات",
      "ي",
      "ون",
      "ين",
      "ات",
      "ي",
      "ا",
      "ي",
      "ت",
      "هم",
      "نك",
    ] // Expanded suffixes
    // for (const suffix of suffixes) {
    //   if (word.endsWith(suffix)) {
    //     console.log(word.slice(0, -suffix.length))
    //     return word.slice(0, -suffix.length)
    // }
    // }
    const response = await fetchWordMeaning(appApi, word)
    meanings[word] = response
    console.log(response)
    return meanings[word]
  }
}
</script>
<style lang="scss">
.word-tooltip {
  font-size: 30px;
}
</style>
