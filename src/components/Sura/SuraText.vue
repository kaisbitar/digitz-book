<template>
  <div
    class="sura-text-container sura-board-overflow scrolling-container pa-2 pb-9 mx-auto bg-surface"
    :class="{ 'reading-mode': isReading }"
    variant="text"
    rounded
  >
    <div
      v-if="isReading"
      class="reading-title d-flex align-center ga-2 bg-surface"
    >
      <SuraHeader class="flex-grow-1" />
      <v-btn
        icon="mdi-fullscreen-exit"
        variant="tonal"
        size="small"
        @click="isReading = false"
      />
    </div>
    <div class="reading-row">
      <v-btn
        v-if="!isReading"
        class="reading-toggle"
        icon="mdi-fullscreen"
        variant="tonal"
        size="small"
        @click="isReading = true"
      />
      <div class="reading-column">
        <div class="mt-4 mb-7 text-center">بسم الله الرحمن الرحيم</div>

        <div class="verse-container">
          <span
            v-for="(verse, index) in versesBasics"
            :key="index"
            class="verse-hit"
            :class="{
              'active-verse-text': isTargetedVerse(index),
              'dimmed-verse': !isTargetedVerse(index),
            }"
            @click="setTargetedVerse(verse.verseText, index + 1)"
          >
            <v-badge
              :content="`${index + 1}`"
              color="count-key-item"
              offset-x="5"
              offset-y="0"
              inline
            ></v-badge>
            <span :id="`v${index + 1}`" class="verse-content">
              <span
                v-if="inputText"
                v-html="highlight(verse.verseText, inputText)"
              />
              <span v-else>{{ verse.verseText }}</span>
            </span>
          </span>
        </div>

        <div class="mt-7 text-center">صدق الله العظيم</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useWindow } from "@/mixins/window"
import { useDataStore } from "@/stores/dataStore"

const { scrollToActiveItem } = useWindow()
const { search, highlight } = useInputFiltering()
const store = useStore()
const dataStore = useDataStore()

const props = defineProps(["inputText", "versesBasics"])
const emit = defineEmits(["verseSelected"])

const target = computed(() => store.getTarget)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(target.value.verseIndex),
)

const isReading = ref(false)

const handleKeyNavigation = (event) => {
  if (event.key === "Escape" && isReading.value) {
    isReading.value = false
    return
  }
  if (!target.value.verseIndex) return
  if (!["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return

  if (event.key === "Enter") {
    store.setActiveSuraTab("versesTab")
    return
  }

  const currentIndex = target.value.verseIndex - 1
  const newIndex =
    event.key === "ArrowUp"
      ? Math.max(0, currentIndex - 1)
      : Math.min(props.versesBasics.length - 1, currentIndex + 1)

  setTargetedVerse(props.versesBasics[newIndex].verseText, newIndex + 1)
}

onMounted(async () => {
  scrollToActiveItem(".active-verse-text", ".sura-text-container")
  await nextTick()
  window.addEventListener("keydown", handleKeyNavigation)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyNavigation)
})

const setTargetedVerse = (verse, index) => {
  const verseNumberToQuran = dataStore.oneQuranFile.find(
    (verse) =>
      verse.fileName === target.value.fileName &&
      verse.verseIndex === parseInt(target.value.verseIndex),
  ).verseNumberToQuran

  const isSameVerse = target.value.verseIndex === index

  store.setTarget({
    ...store.getTarget,
    verseIndex: index,
    verseText: verse,
    verseNumberToQuran,
  })

  if (isSameVerse) {
    emit("verseSelected", props.versesBasics[index - 1])
    return
  }
}

// onMounted(async () => {
//   scrollToActiveItem(".active-verse-text", ".sura-text-container")
//   await nextTick()
// })
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sura-text-container {
  font-size: 1.2rem;
  line-height: 1.8;
  overflow-y: auto;
  max-width: 720px;
  padding: 0 24px 36px !important;
}

.sura-text-container::before {
  content: "";
  position: sticky;
  top: 0;
  z-index: 1;
  display: block;
  height: 28px;
  margin: 0 -24px -28px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-background)),
    transparent
  );
}

.reading-mode::before {
  content: none;
}

@media (max-width: 600px) {
  .sura-text-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
    padding-bottom: 36px !important;
  }

  .sura-text-container::before {
    margin-inline: -16px;
  }
}

.reading-row {
  display: flex;
  align-items: flex-start;
}

.reading-column {
  order: 1;
  flex: 1;
}

.reading-toggle {
  order: 2;
  position: sticky;
  top: 58px;
  z-index: 2;
  margin-inline-start: 8px;
}

@media (max-width: 600px) {
  .reading-row {
    display: block;
  }

  .reading-toggle {
    float: left;
    margin-inline-start: 0;
  }
}

.reading-title {
  position: sticky;
  top: 0;
  z-index: 3;
  padding: 12px 8px;
}

.reading-mode .reading-column {
  max-width: 640px;
  margin-inline: auto;
}

.sura-text-container.reading-mode {
  position: fixed;
  inset: 0;
  z-index: 2400;
  max-width: none;
  height: 100vh !important;
  margin: 0;
  padding-left: 24px !important;
  padding-right: 24px !important;
}

.verse-container {
  text-align: justify;
  text-justify: inter-word;
}

.verse-hit {
  cursor: pointer;
}

.verse-content {
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
