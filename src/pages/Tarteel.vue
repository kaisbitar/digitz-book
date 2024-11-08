<template>
  <div v-if="ratl" class="d-flex pt-4 pb-4 px-4">
    <TarteelHeader
      class=""
      :word="wordData.word"
      :verses-count="wordData.versesCount"
      :occurrence-count="wordData.count"
      @update:isWordMeaningOpen="isWordMeaningOpen = $event"
    />
    <v-btn
      v-if="!isWordMeaningOpen"
      icon="mdi-pencil-outline"
      elevation="1"
      class="mr-auto d-block"
      @click="isUserNoteOpen = true"
    />
    <v-btn
      v-if="isWordMeaningOpen"
      icon="mdi-close"
      elevation="1"
      class="mr-auto"
      @click="isWordMeaningOpen = false"
    />
  </div>

  <template v-if="ratl">
    <v-divider class="mx-auto" width="100%"></v-divider>

    <WordMeaning
      :word="wordData.word"
      class="px-4"
      :isWordMeaningOpen="isWordMeaningOpen"
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'"
      @update:isWordMeaningOpen="isWordMeaningOpen = $event"
      @click="isWordMeaningOpen = true"
      @meaningItemClick="isUserNoteOpen = true"
    />

    <UserNote
      v-model="isUserNoteOpen"
      :word="wordData.word"
      :verses="wordData.verses"
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
        :textToHighlight="wordData.word"
        :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
        :class="{
          'active-verse-text':
            parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
        }"
        @click="handleSelectedVerse(verse, wordData.word)"
      />
      <div class="mt-5 mb-3 text-center">صدق الله العظيم</div>
    </div>
  </template>
  <template v-else>
    <NoData
      text="ورتل القرآن ترتيلا.."
      icon="mdi-book-open-page-variant-outline"
    />
  </template>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useIndexedPagination } from "@/hooks/useIndexedPagination"
import { useNotesStore } from "@/stores/notesStore"

const tarteelStore = useTarteelStore()
const router = useRouter()
const store = useStore()
const notesStore = useNotesStore()

const isUserNoteOpen = ref(false)
const isWordMeaningOpen = ref(false)

const ratl = computed(() => tarteelStore.getSelectedRatl)

const wordData = computed(() => {
  if (!ratl.value)
    return {
      word: "",
      versesCount: 0,
      count: 0,
      verses: [],
    }

  return {
    word: ratl.value.word || "",
    versesCount: ratl.value.verses?.length || 0,
    count: ratl.value.count || 0,
    verses: ratl.value.verses || [],
  }
})

const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)

const { paginatedItems, handleInfiniteScroll, isLoading } =
  useIndexedPagination(
    computed(() => ratl.value?.verses || []),
    targetedVerseIndex
  )

const handleSelectedVerse = (verse, tarteel) => {
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex,
    verseNumberToQuran: verse.verseNumberToQuran.toString(),
    verseText: verse.verseText,
    tarteel,
  })
  router.push("sura")
}

const { scrollToActiveItem } = useWindow()

const handleScrolling = () => {
  scrollToActiveItem(".active-verse-text", ".tarteel-container")
}

watch(
  () => ratl.value,
  () => {
    handleScrolling()
  }
)

onMounted(async () => {
  await nextTick()
  handleScrolling()
})
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
