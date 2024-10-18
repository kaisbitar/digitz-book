<template>
  <div ref="suraTextRef">
    <v-card
      class="px-4 sura-text-container scrolling-container"
      :height="dynamicHeight"
      variant="plain"
    >
      <span
        v-for="(verse, index) in suraTextArray"
        :key="index"
        @click="setTargetedVerse(verse, index + 1)"
        :class="{
          'active-verse-text': isTargetedVerse(index),
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
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useQuranStore()

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
  height: 100%;
  display: block;
  line-height: 2.5;
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
  padding: 4px 0px 8px 5px;
  background-color: rgb(var(--v-theme-active-row)) !important;
}
</style>
