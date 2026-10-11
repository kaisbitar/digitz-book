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
        :verse-count="verseCount"
        :text-to-highlight="selectedWord || word"
        :exact="exact"
        :targeted-verse-index="targetedVerseIndex"
        :handle-infinite-scroll="handleInfiniteScroll"
        @verse-selected="(verse) => emit('verseSelected', verse)"
      />

      <v-card variant="outlined" class="pill-group d-flex flex-column">
        <v-card-title class="d-flex align-center text-grey-darken-1 text-subtitle-1">
          <span>المعاجم</span>
          <span v-if="meaningHeader.label" class="ms-3">{{ meaningHeader.label }}</span>
          <v-btn
            v-if="meaningHeader.hasNext"
            size="x-small"
            variant="tonal"
            class="ms-auto"
            @click="meaning.nextWord()"
          >
            التالي
          </v-btn>
        </v-card-title>
        <div class="pill-group-overflow flex-grow-1">
          <WordMeaning
            ref="meaning"
            :word="word"
            :isWordMeaningOpen="true"
            :show-header="false"
            @header="meaningHeader = $event"
          />
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

      <v-card variant="outlined" class="pill-group d-flex flex-column">
        <v-card-title class="text-grey-darken-1 text-subtitle-1">
          السور ({{ suras.length }})
        </v-card-title>
        <div class="pill-group-overflow flex-grow-1">
          <div class="d-flex flex-wrap align-content-start ga-3 pa-3">
            <v-chip
              v-for="sura in suras"
              :key="sura"
              color="secondary"
              size="large"
            >
              {{ sura }}
            </v-chip>
          </div>
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
      >
        <template v-if="!getGroupItems(groupType).length" #empty>
          <span class="text-caption text-grey">لا توجد كلمات مشابهة صوتيًا</span>
        </template>
      </WordPillGroup>
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
  verseCount: {
    type: Number,
    default: 0,
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
const meaning = ref(null)
const meaningHeader = ref({ label: "", hasNext: false })

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

// Suras that contain any of the derived words
const suras = computed(() =>
  [
    ...new Set(props.items.flatMap((item) => item.suras || [])),
  ].sort(),
)

const trailingGroups = computed(() => ["other"])
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
