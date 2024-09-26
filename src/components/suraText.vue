<template>
  <v-container class="sura-text-container scrolling-container">
    <span
      v-for="(verse, index) in suraTextArray"
      :key="index"
      @click="setTargetedVerse(verse, index + 1)"
      :class="{ 'active-verse': isTargetedVerse(index) }"
    >
      <span :id="`v${index + 1}`" class="verse-content">
        <span
          class="num-chip"
          :class="{ 'active-chip': isTargetedVerse(index) }"
        >
          {{ index + 1 }}
        </span>
        <span v-if="inputText" v-html="highlightVerseText(verse, inputText)" />
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

<style scoped>
.sura-text-container {
  display: block;
  line-height: 2.5;
  max-height: 79vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.verse-content {
  cursor: pointer;
  font-weight: 200;
}

.num-chip {
  /* background: rgb(var(--v-theme-on-highlight)); */
  margin: 0 6px;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.8em;
}

.targeted-verse {
  color: rgb(var(--v-theme-on-active-row));
  background: rgb(var(--v-theme-active-row));
  font-weight: 300;
}

.targeted-verse .num-chip {
  color: rgb(var(--v-theme-on-active-row));
}

.active-chip {
  background: rgb(var(--v-theme-on-active-row));
  color: rgb(var(--v-theme-active-row));
}

@media (max-width: 655px) {
  .sura-text-search-results {
    display: block;
  }
}
</style>
