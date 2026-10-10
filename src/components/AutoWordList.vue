<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="pill-groups-grid">
      <WordPillGroup
        v-if="wordItems.length"
        :title="wordsTitle"
        :items="wordItems"
        :selected-word="selectedWord"
        @select="(item) => emit('select', item)"
        @remove="removeItem"
      />

      <VersesTile
        :word="selectedWord || word"
        :verses="paginatedItems"
        :text-to-highlight="word"
        :exact="exact"
        :targeted-verse-index="targetedVerseIndex"
        :handle-infinite-scroll="handleInfiniteScroll"
        @verse-selected="(verse) => emit('verseSelected', verse)"
      />

      <v-card variant="outlined" class="pill-group d-flex flex-column">
        <v-card-title class="text-grey-darken-1 text-subtitle-1">
          المعاجم
        </v-card-title>
        <div class="pill-group-overflow flex-grow-1">
          <WordMeaning :word="word" :isWordMeaningOpen="true" />
        </div>
      </v-card>

      <v-card variant="outlined" class="pill-group d-flex flex-column">
        <v-card-title class="text-grey-darken-1 text-subtitle-1">
          الحروف
        </v-card-title>
        <div class="pill-group-overflow flex-grow-1 px-2">
          <LetterMeanings :root="root || word" />
        </div>
      </v-card>

      <WordPillGroup
        v-for="groupType in trailingGroups"
        :key="groupType"
        :title="getGroupTitle(groupType)"
        :items="visibleItems(groupType)"
        :selected-word="selectedWord"
        @select="(item) => emit('select', item)"
        @remove="removeItem"
      />
    </div>
    <v-btn
      v-if="hiddenSoundAlikes"
      variant="text"
      block
      @click="showAllSoundAlikes = true"
    >
      عرض الباقي ({{ hiddenSoundAlikes }})
    </v-btn>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import WordPillGroup from "@/components/Tarteel/WordPillGroup.vue"
import WordMeaning from "@/components/WordMeaning.vue"
import LetterMeanings from "@/components/Tarteel/LetterMeanings.vue"
import VersesTile from "@/components/Tarteel/VersesTile.vue"

const SOUND_ALIKE_LIMIT = 100

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedWord: {
    type: String,
    default: "",
  },
  word: {
    type: String,
    default: "",
  },
  root: {
    type: String,
    default: "",
  },
  paginatedItems: {
    type: Array,
    default: () => [],
  },
  exact: {
    type: Boolean,
    default: false,
  },
  targetedVerseIndex: {
    type: [String, Number],
    default: 0,
  },
  handleInfiniteScroll: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits([
  "select",
  "update:currentWordsList",
  "verseSelected",
])
const showAllSoundAlikes = ref(false)

watch(
  () => props.items.word,
  () => {
    showAllSoundAlikes.value = false
  },
)

const getGroupTitle = (group) => {
  const root = props.items.wordRoot
  const titles = {
    exact: "مطابقة تامة",
    root: root ? `مشتقات الجذر ${root}` : "مشتقات",
    attached: "صيغ متصلة",
    other: "تشابه صوتي",
  }
  return titles[group] || group
}

const removeItem = (item) => {
  const newFilteredWords = props.items.filter((word) => word.word !== item.word)
  newFilteredWords.wordRoot = props.items.wordRoot
  newFilteredWords.word = props.items.word
  emit("update:currentWordsList", newFilteredWords)
}

const getGroupItems = (groupType) => {
  return props.items.filter((item) => (item.group || "exact") === groupType)
}

const visibleItems = (groupType) => {
  const items = getGroupItems(groupType)
  if (groupType !== "other" || showAllSoundAlikes.value) return items
  return items.slice(0, SOUND_ALIKE_LIMIT)
}

const hiddenSoundAlikes = computed(() => {
  if (showAllSoundAlikes.value) return 0
  const other = getGroupItems("other")
  if (other.length === 0) return 0
  return Math.max(0, other.length - SOUND_ALIKE_LIMIT)
})

// Exact matches first, then root derivatives, in one tile
const wordItems = computed(() =>
  ["exact", "root", "attached"].flatMap((groupType) =>
    visibleItems(groupType),
  ),
)

const wordsTitle = computed(() => {
  const root = props.items.wordRoot
  return root ? `مشتقات الجذر ${root}` : "الكلمات"
})

const trailingGroups = computed(() =>
  ["other"].filter((groupType) => getGroupItems(groupType).length),
)
</script>

<style scoped>
/* Square-style tiles: 2 per row on desktop, 1 on mobile */
.pill-groups-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  align-items: start;
}

.pill-groups-grid > * {
  max-height: 40vh;
}

/* The analysis tiles reuse WordPillGroup's class names, but scoped styles
   only apply to this component's own elements. Constrain them here. */
.pill-groups-grid > .pill-group {
  overflow: hidden;
}

.pill-groups-grid > .pill-group > .pill-group-overflow {
  min-height: 0;
  overflow-y: auto;
}

@media (min-width: 1100px) {
  .pill-groups-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .pill-groups-grid {
    grid-template-columns: 1fr;
  }

  .pill-groups-grid > * {
    max-height: 34vh;
  }
}
</style>
