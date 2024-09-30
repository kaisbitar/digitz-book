<template>
  <!-- <v-lazy :options="{ threshold: 0.9 }" transition="fade-transition"> -->
  <div class="d-flex mt-2 align-center">
    <v-chip size="x-small" variant="outlined" class="fixed-width ml-3">
      {{ index + 1 }}
    </v-chip>

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
  <!-- </v-lazy> -->
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
  /* text-align: center; */
  /* z-index: 1000; */
}
.v-list-item__content {
  padding-right: 12px;
  margin-right: -9px;
}
</style>
