<template>
  <v-container class="sura-text-container scrolling-container">
    <span
      v-for="(verse, index) in suraTextArray"
      :key="index"
      @click="setTargetedVerse(verse, index + 1)"
      :class="{
        'active-verse': isTargetedVerse(index),
      }"
    >
      <span :id="`v${index + 1}`" class="verse-content">
        <span
          class="num-chip"
          :class="{ 'active-chip': isTargetedVerse(index) }"
        >
          {{ index + 1 }}
        </span>
        <span v-if="inputText" v-html="highlight(verse, inputText)" />
        <span v-else>{{ verse }}</span>
      </span>
    </span>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
import { useGoTo } from "vuetify"

const { scrollToActiveItem } = useWindow()

const props = defineProps(["inputText", "suraTextArray"])

const store = useQuranStore()
const goTo = useGoTo()
import { useInputFiltering } from "@/mixins/inputFiltering"
const { search, highlight } = useInputFiltering()

const suraTargetedVerseIndex = computed(() => store.getTarget?.verseIndex)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(suraTargetedVerseIndex.value)
)

const setTargetedVerse = (verse, index) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: index,
    verseNumberToQuran: verse.verseNumberToQuran,
  })
}

const highlightVerseText = (text, value) => {
  if (value === null) return text
  text = text.replace(/[\u064b-\u064f\u0650-\u0652]/g, "")
  const query = new RegExp(value, "ig")
  return text.replace(query, (match) => {
    return (
      '<span class="bg-orange-lighten-3 font-weight-bold">' + match + "</span>"
    )
  })
}

onMounted(() => {
  scrollToActiveItem(".active-verse", ".sura-text-container")
})
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

.sura-text-container {
  display: block;
  line-height: 2;
  max-height: 68vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.verse-content {
  cursor: pointer;
  font-weight: 200;
}

.num-chip {
  background: rgb(var(--v-theme-verse-number-chip));
  margin: 0 6px;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.9em;
  color: rgb(var(--v-theme-on-verse-number-chip));
  font-weight: 600;
  border: 1px solid #000;
}

.active-chip {
  background: rgb(var(--v-theme-on-active-row));
  color: rgb(var(--v-theme-active-row));
  border: 3px solid #131313d9;
}
.active-verse .verse-content {
  padding: 8px 4px 9px 8px;
  border-radius: 4px;
  background: rgb(var(--v-theme-active-row));
  border: 1px solid #131313d9;
  font-weight: 700;
}

@media (max-width: 655px) {
  .sura-text-search-results {
    display: block;
  }
}
</style>
