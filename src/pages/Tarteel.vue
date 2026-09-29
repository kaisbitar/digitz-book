<template>
  <v-container max-width="1200" class="px-sm-4 px-2">
    <template v-if="showChartView">
      <!-- Letters chart fills the page as a background; the history card sits on it -->
      <div class="position-relative chart-history-page">
        <div class="position-absolute w-100 h-100 chart-layer">
          <LettersChart :letter="liveLetter || ''" fill />
        </div>
        <v-row v-if="historyItems.length" class="position-relative mt-0">
          <v-col cols="12" md="5">
            <SearchHistory
              :items="historyItems"
              :selected-id="tarteelStore.getSelectedTarteelId"
              @select="openHistoryItem"
              @remove="removeHistoryItem"
            />
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-else-if="ratl">
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
      <v-row justify="center" class="mt-4">
        <v-col cols="12" md="6">
          <SearchHistory
            v-if="historyItems.length"
            :items="historyItems"
            :selected-id="tarteelStore.getSelectedTarteelId"
            @select="openHistoryItem"
            @remove="removeHistoryItem"
          />
          <NoData
            v-else
            text="ورتل القرآن ترتيلا.."
            icon="mdi-book-open-page-variant-outline"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter, useRoute } from "vue-router"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useWindow } from "@/mixins/window"
import { useIndexedPagination } from "@/hooks/useIndexedPagination"
import { useNotesStore } from "@/stores/notesStore"
import WordsOverview from "@/components/Tarteel/WordsOverview.vue"
import WordsList from "@/components/Tarteel/WordsList.vue"
import WordVerses from "@/components/Tarteel/WordVerses.vue"
import SearchHistory from "@/components/SearchHistory.vue"
import LettersChart from "@/components/LettersChart.vue"

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
  const hasSingleResult = selectedTarteel.value?.results?.length === 1

  if (hasSingleResult) {
    tarteelStore.setSelectedRatl(selectedTarteel.value.results[0])
    store.setTarget(ratl.value.verses[0])
    return WordVerses
  }

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

// Newest search first
const historyItems = computed(() =>
  [...tarteelStore.getStoredTarteels].reverse()
)

const liveLetter = computed(() => tarteelStore.liveLetter)
const showChartView = computed(
  () => !!tarteelStore.liveLetter || tarteelStore.chartVisible
)

const openHistoryItem = (item) => {
  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  document.activeElement?.blur?.()
  tarteelStore.setSelectedTarteelId(item.id)
  tarteelStore.setSelectedRatlIndex(0)
  tarteelStore.setSelectedRatl(item.results?.[0] ?? null)
  router.push({ name: "tarteel", query: { view: "list" } })
}

const removeHistoryItem = (item) => {
  tarteelStore.removeTarteelItem(item.id)
  const selected = tarteelStore.getSelectedTarteel
  tarteelStore.setSelectedRatl(selected?.results?.[0] ?? null)
  tarteelStore.setSelectedRatlIndex(selected ? 0 : null)
}

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
  store.setActiveSuraTab("suraText")
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
/* Fill the space under the app bar; the chart sits behind the history list */
.chart-history-page {
  height: calc(100vh - 92px);
}
.chart-layer {
  top: 0;
  left: 0;
  opacity: 0.85;
  pointer-events: none;
}
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
