<template>
  <!-- {{ suraTextArray }} -->
  <div ref="suraTextRef">
    <v-card
      class="sura-text-container scrolling-container pa-sm-10 pa-2 pb-9 mx-auto bg-surface mt-1"
      :height="dynamicHeight"
      max-width="850px"
      elevation="1"
      rounded
    >
      <div class="mb-7 text-center">بسم الله الرحمن الرحيم</div>

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
          color="count"
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
      <div class="mt-7 text-center">صدق الله العظيم</div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useStore()

const props = defineProps(["inputText", "suraTextArray"])

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

const suraTextRef = ref(null)
const { setContainerHeight, dynamicHeight } = useWindow(suraTextRef)
useResizeHandler({ elementRef: suraTextRef, elementFunc: setContainerHeight })

onMounted(async () => {
  scrollToActiveItem(".active-verse-text", ".sura-text-container")
  await nextTick()
  setContainerHeight()
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sura-text-container {
  font-size: 19px;
  line-height: 2;
  overflow-y: auto;
}

.verse-content {
  cursor: pointer;
}
.dimmed-verse {
  opacity: 0.5;
  padding: 4px 0px 8px 5px;
}
.active-verse-text {
  padding: 12px;
  background-color: rgb(var(--v-theme-active-row)) !important;
  border-radius: 4px;
}
</style>
