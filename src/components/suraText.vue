<template>
  <v-card
    class="sura-text-container overflow-y-auto scrolling-container px-sm-10 px-2 pb-9 mx-auto bg-surface"
    max-width="850px"
    variant="text"
    rounded
  >
    <div class="mt-4 mb-7 text-center">بسم الله الرحمن الرحيم</div>

    <div class="verse-container">
      <span
        v-for="(verse, index) in suraTextArray"
        :key="index"
        @click="setTargetedVerse(verse, index + 1)"
        :class="{
          'active-verse-text': isTargetedVerse(index),
          'dimmed-verse': !isTargetedVerse(index),
        }"
      >
        <v-badge
          :content="`${index + 1}`"
          color="verse-count"
          offset-x="5"
          offset-y="0"
          inline
        ></v-badge>
        <span
          :id="`v${index + 1}`"
          class="verse-content"
          @click="setTargetedVerse(verse, index + 1)"
        >
          <span v-if="inputText" v-html="highlight(verse, inputText)" />
          <span v-else>{{ verse }}</span>
        </span>
      </span>
    </div>

    <div class="mt-7 text-center">صدق الله العظيم</div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"

const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useStore()

const props = defineProps(["inputText", "suraTextArray"])

const suraTargetedVerseIndex = computed(() => store.getTarget?.verseIndex)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(suraTargetedVerseIndex.value)
)

const setTargetedVerse = (verse, index) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: index,
    verseNumberToQuran: verse.verseNumberToQuran,
    verseText: verse.verseText,
  })
}

onMounted(async () => {
  scrollToActiveItem(".active-verse-text", ".sura-text-container")
  await nextTick()
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sura-text-container {
  font-size: 19px;
  line-height: 2;
  overflow-y: auto;
}

.verse-container {
  text-align: justify;
  text-justify: inter-word;
}

.verse-content {
  cursor: pointer;
  display: inline;
}

.dimmed-verse {
  opacity: 0.5;
  padding: 12px 0px 12px 0px;
}

.active-verse-text {
  padding: 2px 4px;
  background-color: rgb(var(--v-theme-active-row)) !important;
  border-radius: 4px;
  padding: 12px 5px 12px 10px;
}
</style>
