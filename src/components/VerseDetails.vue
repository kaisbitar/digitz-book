<template>
  <!-- <v-dialog
        :modelValue="modelValue"
        width="900"
        @update:modelValue="$emit('update:modelValue', $event)"
        @click:outside="handleClose"
      > -->
  <!-- <template v-slot:default="{ isActive }"> -->
  <v-container>
    <div class="text-h3">
      <span v-for="(word, index) in verseWords" :key="index">
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span
              v-bind="props"
              class="mx-1"
              @mouseover="displayMeaning(word)"
              >{{ word }}</span
            >
          </template>
          <!-- Display the meaning as HTML inside the tooltip, each array element separated -->
          <span v-if="meanings[word]">
            <span
              v-for="(meaning, i) in meanings[word]"
              :key="i"
              v-html="meaning"
            ></span>
          </span>
          <span v-else>Loading...</span>
        </v-tooltip>
      </span>
    </div>

    <div class="text-h3">
      <span class="text-caption">كلمة</span>{{ countVerseWords(verse) }}
    </div>
    <div class="text-h3">
      <span class="text-caption">حرف</span>{{ countVerseLetters(verse) }}
    </div>
  </v-container>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import { fetchWordMeaning } from "../api/api.js"

const appApi = import.meta.env.VITE_APP_API_URL
const emit = defineEmits(["update:modelValue"])
const { countVerseWords, countVerseLetters } = useCounting()
const meanings = reactive({})

const props = defineProps({
  modelValue: Boolean,
  verse: String,
})

const verseWords = computed(() => props.verse.split(" "))

const displayMeaning = async (word) => {
  if (!meanings[word]) {
    // const response = await fetchWordMeaning(appApi, word)
    // meanings[word] = response
  }
}

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
