<template>
  <div>
    <div v-if="ratl" class="d-flex pt-4 pb-4 px-4">
      <v-btn
        v-if="!isWordMeaningOpen"
        icon="mdi-pencil-outline"
        variant="tonal"
        size="small"
        class="ml-auto d-block"
        @click="$emit('update:isUserNoteOpen', true)"
      />
      <TarteelWordDetailHeader
        :word="word"
        :verses-count="versesCount"
        :occurrence-count="count"
        @update:isWordMeaningOpen="$emit('update:isWordMeaningOpen', $event)"
      />
      <v-btn
        icon="mdi-arrow-left"
        variant="tonal"
        size="small"
        class="mr-auto d-block"
        @click="$emit('back-to-list')"
      />

      <v-btn
        v-if="isWordMeaningOpen"
        icon="mdi-close"
        variant="tonal"
        size="small"
        class="mr-auto"
        @click="$emit('update:isWordMeaningOpen', false)"
      />
    </div>

    <template v-if="ratl">
      <v-divider class="mx-auto" width="100%"></v-divider>

      <WordMeaning
        :word="word"
        class="px-4"
        :isWordMeaningOpen="isWordMeaningOpen"
        :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'"
        @update:isWordMeaningOpen="$emit('update:isWordMeaningOpen', $event)"
        @click="$emit('update:isWordMeaningOpen', true)"
        @meaningItemClick="$emit('update:isUserNoteOpen', true)"
      />

      <div
        class="tarteel-container tarteel-board-overflow"
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
        <div class="mt-5 mb-3 text-center">صدق الله العظيم</div>
      </div>
    </template>
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
  height: calc(100vh - 230px);
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
