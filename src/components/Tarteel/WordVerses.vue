<template>
  <div>
    <WordVersesHeader
      :word="word"
      :verses-count="versesCount"
      :occurrence-count="count"
      :is-word-meaning-open="isWordMeaningOpen"
      @update:isWordMeaningOpen="$emit('update:isWordMeaningOpen', $event)"
      @update:isUserNoteOpen="$emit('update:isUserNoteOpen', $event)"
      @back-to-list="$emit('back-to-list')"
    />

    <v-divider class="mx-auto" width="100%"></v-divider>

    <WordMeaning
      class="px-sm-3"
      :word="word"
      :isWordMeaningOpen="isWordMeaningOpen"
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'"
      @update:isWordMeaningOpen="$emit('update:isWordMeaningOpen', $event)"
      @click="$emit('update:isWordMeaningOpen', true)"
      @meaningItemClick="$emit('update:isUserNoteOpen', true)"
    />

    <div
      class="tarteel-container tarteel-board-overflow px-sm-4"
      @scroll="handleInfiniteScroll"
    >
      <VerseCardItem
        v-for="(verse, index) in paginatedItems"
        :item="verse"
        :key="verse.originalIndex"
        :index="index"
        :textToHighlight="word"
        :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
        :class="{
          'active-verse-text':
            parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
        }"
        @click="handleSelectedVerse(verse)"
      />
      <div class="mt-5 mb-6 text-center">صدق الله العظيم</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  ratl: {
    type: Object,
    required: true,
  },
  isWordMeaningOpen: {
    type: Boolean,
    required: true,
  },
  isUserNoteOpen: {
    type: Boolean,
    required: true,
  },
  paginatedItems: {
    type: Array,
    required: true,
  },
  targetedVerseIndex: {
    type: [String, Number],
    required: true,
  },
  handleInfiniteScroll: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  "update:isWordMeaningOpen",
  "update:isUserNoteOpen",
  "verseSelected",
  "back-to-list",
])

// Computed properties from ratl
const word = computed(() => props.ratl?.word || "")
const versesCount = computed(() => props.ratl?.verses?.length || 0)
const count = computed(() => props.ratl?.count || 0)
const verses = computed(() => props.ratl?.verses || [])

const handleSelectedVerse = (verse) => {
  emit("verseSelected", { verse, word: word.value })
}
</script>

<style scoped>
.tarteel-board-overflow {
  height: calc(100vh - 270px);
  overflow: auto;
}
.fixed-height {
  height: 94px;
  overflow: hidden;
}
.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
