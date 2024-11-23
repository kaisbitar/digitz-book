<template>
  <TarteelTabs />
  <v-container max-width="1200">
    <template v-if="ratl">
      <component
        :is="currentView"
        :selectedTarteel="selectedTarteel"
        :ratl="ratl"
        :isWordMeaningOpen="isWordMeaningOpen"
        :isUserNoteOpen="isUserNoteOpen"
        :paginatedItems="paginatedItems"
        :targetedVerseIndex="targetedVerseIndex"
        :handleInfiniteScroll="handleInfiniteScroll"
        @ratl-selected="showDetail"
        @back-to-overview="showOverview"
        @back-to-list="showList"
        @update:isWordMeaningOpen="isWordMeaningOpen = $event"
        @update:isUserNoteOpen="isUserNoteOpen = $event"
        @verseSelected="({ verse, word }) => handleSelectedVerse(verse, word)"
      />
      <UserNote
        v-model="isUserNoteOpen"
        :word="ratlData.word"
        :verses="ratlData.verses"
      />
    </template>
    <template v-else>
      <NoData
        text="ورتل القرآن ترتيلا.."
        icon="mdi-book-open-page-variant-outline"
      />
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter, useRoute } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useIndexedPagination } from "@/hooks/useIndexedPagination"
import { useNotesStore } from "@/stores/notesStore"
import WordsOverview from "@/components/Tarteel/WordsOverview.vue"
import WordsList from "@/components/Tarteel/WordsList.vue"
import WordVerses from "@/components/Tarteel/WordVerses.vue"

const tarteelStore = useTarteelStore()
const router = useRouter()
const route = useRoute()
const store = useStore()
const notesStore = useNotesStore()

const VIEW_TYPES = {
  OVERVIEW: "overview",
  LIST: "list",
  DETAIL: "detail",
}

const currentView = computed(() => {
  const view = route.query.view || VIEW_TYPES.LIST
  return {
    [VIEW_TYPES.OVERVIEW]: WordsOverview,
    [VIEW_TYPES.LIST]: WordsList,
    [VIEW_TYPES.DETAIL]: WordVerses,
  }[view]
})

const currentViewType = computed(() => route.query.view || VIEW_TYPES.LIST)

const isUserNoteOpen = ref(false)
const isWordMeaningOpen = ref(false)

const ratl = computed(() => tarteelStore.getSelectedRatl)
const selectedTarteel = computed(() => {
  return tarteelStore.getStoredTarteels.find(
    (tarteel) => tarteel.id === tarteelStore.getSelectedTarteelId
  )
})

const ratlData = computed(() => {
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
  const query = {
    ...router.currentRoute.value.query,
    tarteel,
  }
  delete query.view

  store.setTarget({
    ...verse,
    tarteel,
  })
  router.push({
    path: `/sura/${verse.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, "")}/${
      verse.verseIndex
    }`,
    query,
  })
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

const showDetail = () => {
  router.push({ query: { ...route.query, view: VIEW_TYPES.DETAIL } })
}

const showOverview = () => {
  router.push({ query: { ...route.query, view: VIEW_TYPES.OVERVIEW } })
}

const showList = () => {
  router.push({ query: { ...route.query, view: VIEW_TYPES.LIST } })
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
