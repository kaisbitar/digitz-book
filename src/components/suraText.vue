<template>
  <v-container class="sura-text-container scrolling-container theme-text-color">
    <span
      v-for="(verse, index) in suraTextArray"
      :key="index"
      @click="setTargetedVerse(verse, index + 1)"
      :class="{
        'active-verse': isTargetedVerse(index),
        'dimmed-verse': !isTargetedVerse(index),
      }"
    >
      <v-chip
        class="ml-2 mr-"
        size="x-small"
        color=""
        variant="outlined"
        :class="{ 'active-chip': isTargetedVerse(index) }"
        @click="hasActiveVerse && setTargetedVerse(verse, index + 1)"
      >
        {{ index + 1 }}
      </v-chip>
      <span
        :id="`v${index + 1}`"
        class="verse-content"
        @click="setTargetedVerse(verse, index + 1)"
      >
        <span v-if="inputText" v-html="highlight(verse, inputText)" />
        <span v-else>{{ verse }}</span>
      </span>
    </span>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"
import { useGoTo } from "vuetify"

const { scrollToActiveItem } = useWindow()

const props = defineProps(["inputText", "suraTextArray"])

const store = useQuranStore()
const goTo = useGoTo()
const { search, highlight } = useInputFiltering()

const suraTargetedVerseIndex = computed(() => store.getTarget?.verseIndex)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(suraTargetedVerseIndex.value)
)
const hasActiveVerse = computed(() => {
  return suraTextArray.some((_, index) => isTargetedVerse.value(index))
})

const setTargetedVerse = (verse, index) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: index,
    verseNumberToQuran: verse.verseNumberToQuran,
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
  line-height: 1.8;
  min-height: 72vh;
  max-height: 72vh;
  overflow-y: auto;
}

.verse-content {
  cursor: pointer;
}
.dimmed-verse {
  opacity: 0.5;
  padding: 4px 0px 8px 5px;
}
.active-verse {
  padding: 4px 0px 8px 5px;
  background-color: rgb(var(--v-theme-hover-color)) !important;
}
// .num-chip {
//   background: rgb(var(--v-theme-verse-number-chip));
//   margin: 0 6px;
//   padding: 2px 6px;
//   border-radius: 12px;
//   font-size: 0.9em;
//   color: rgb(var(--v-theme-on-verse-number-chip));
//   font-weight: 600;
//   border: 1px solid #000;
// }

// .active-chip {
//   background: rgb(var(--v-theme-on-active-row));
//   color: rgb(var(--v-theme-active-row));
//   border: 3px solid #131313d9;
// }
// .active-verse .verse-content {
//   padding: 8px 4px 9px 8px;
//   border-radius: 4px;
//   background: rgb(var(--v-theme-active-row));
//   border: 1px solid #131313d9;
//   font-weight: 700;
// }
</style>
