<template>
  <div ref="suraTextRef" :style="{ height: `${dynamicTableHeight}px` }">
    <v-card class="px-4 sura-text-container scrolling-container">
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
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"

const { updateTableHeight, dynamicTableHeight } = useWindow()
const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useQuranStore()

const props = defineProps(["inputText", "suraTextArray"])

const suraTextRef = ref(null)
let resizeObserver = null

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

const updateHeight = async () => {
  await nextTick()
  updateTableHeight(suraTextRef)
}
onMounted(() => {
  scrollToActiveItem(".active-verse", ".sura-text-container")
  resizeObserver = new ResizeObserver(() => {
    updateHeight()
  })
  resizeObserver.observe(suraTextRef.value)
  updateHeight()
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

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
.active-verse {
  padding: 4px 0px 8px 5px;
  background-color: rgb(var(--v-theme-active-row)) !important;
}
</style>
