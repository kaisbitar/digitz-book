<template>
  <v-lazy
    :min-height="30"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <div class="d-flex mt-2 align-center">
      <v-chip
        size="x-small"
        variant="outlined"
        class=".fixed-width ml-2 text-caption"
        >{{ index + 1 }}</v-chip
      >

      <div>
        <div class="text-blue mb-n1">{{ item.fileName }}</div>
        <div v-html="highlight(item.verseText, textToHighlight)" />
        <div class="mt-n1 text-caption text-grey">
          <span class="ml-7">رقم: {{ item.verseIndex }}</span>
          <span class="ml-7">كلمة: {{ item.numberOfWords }} </span>
          <span class="ml-7">حرف: {{ item.numberOfLetters }} </span>
          <span class="ml-7">مصحف: {{ item.verseNumberToQuran }}</span>
        </div>
      </div>
    </div>
  </v-lazy>
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"
const { highlight } = useInputFiltering()

const props = defineProps(["item", "textToHighlight", "index"])
const emit = defineEmits(["verseClicked"])

const handleClick = () => {
  emit("verseClicked")
}
</script>

<style>
.fixed-width .v-chip__content {
  min-width: 50px !important; /* Set your desired fixed width here */
  max-width: 50px !important; /* Ensure it does not exceed this width */
  text-align: center; /* Center text if needed */
}
</style>
