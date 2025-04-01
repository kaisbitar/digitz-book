<template>
  <div
    class="sura-text-container sura-board-overflow scrolling-container px-sm-10 pa-2 pb-9 mt-1 mx-auto bg-surface"
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
          color="count-key-item"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"
import { useDataStore } from "@/stores/dataStore"

const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useStore()
const dataStore = useDataStore()

const props = defineProps(["inputText", "suraTextArray"])

const target = computed(() => store.getTarget)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(target.value.verseIndex)
)

const setTargetedVerse = (verse, index) => {
  const verseNumberToQuran = dataStore.oneQuranFile.find(
    (verse) =>
      verse.fileName === target.value.fileName &&
      verse.verseIndex === parseInt(target.value.verseIndex)
  ).verseNumberToQuran
  store.setTarget({
    ...store.getTarget,
    verseIndex: index,
    verseText: verse,
    verseNumberToQuran,
  })
  store.setActiveSuraTab("versesTab")
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
  line-height: 1.8;
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
  opacity: 0.8;
  padding: 12px 0px 12px 0px;
}

.active-verse-text {
  // padding: 2px 4px;
  background-color: rgb(var(--v-theme-active-row)) !important;
  border-radius: 4px;
  padding: 8px 0px 8px 0px;
}
</style>
