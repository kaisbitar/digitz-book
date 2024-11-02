<template>
  <div
    v-if="ratl && ratl.verses"
    class="d-flex flex-column h-100 pa-0 pt-4 px-4"
  >
    <TarteelHeader
      :word="ratl.word"
      :verses-count="ratl.verses.length"
      :occurrence-count="ratl.count"
      v-model:expanded="expanded"
    />

    <TarteelWordMeaning
      :class="expanded ? 'tarteel-meaning-overflow' : 'fixed-height'"
      :word="ratl.word"
      @click="expanded = !expanded"
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
        :textToHighlight="ratl.word"
        :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
        :class="{
          'active-verse-text':
            parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
        }"
        @click="handleSelectedVerse(verse, ratl.word)"
      />
      <div class="mt-5 mb-3 text-center">صدق الله العظيم</div>
    </div>
  </div>

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
import { usePagination } from "@/hooks/usePagination"
import TarteelHeader from "@/components/TarteelHeader.vue"

const tarteelStore = useTarteelStore()
const router = useRouter()
const store = useStore()

const expanded = ref(false)

const searchedTarteels = computed(() => tarteelStore.getStoredTarteels)
const ratl = computed(() => tarteelStore.getSelectedRatl)
const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)

const { paginatedItems, handleInfiniteScroll, isLoading } = usePagination(
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

watch(
  () => searchedTarteels.value,
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
  height: calc(100vh - 205px);
  overflow: auto;
}
.fixed-height {
  height: 100px; /* or whatever height you prefer */
  overflow: hidden;
}

.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
