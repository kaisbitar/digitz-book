<template>
  <div v-if="ratl && ratl.verses">
    <div class="d-flex mb-4">
      <div class="text-h4 ml-4">{{ ratl.word }}</div>
      <v-badge
        v-for="badge in badges"
        :key="badge.id"
        :color="badge.color"
        :content="badge.content"
        :offset-x="badge.offsetX"
        :offset-y="badge.offsetY"
      ></v-badge>
    </div>

    <v-toolbar title="المعنى" class="" rounded density="compact"> </v-toolbar>
    <div
      ref="tarteelContainer"
      class="tarteel-container"
      :style="{ height: `${dynamicHeight}px`, overflowY: 'auto' }"
      @scroll="handleVirtualScroll"
    >
      <VerseCardItem
        v-for="verse in paginatedItems"
        :item="verse"
        :key="verse.originalIndex"
        :index="verse.originalIndex"
        :textToHighlight="ratl.word"
        :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
        :class="{
          'active-verse-text':
            parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
        }"
        @click="handleSelectedVerse(verse, ratl.word)"
      />
      <v-progress-linear
        v-if="isLoading"
        :height="4"
        color="verse-count"
        indeterminate
        rounded
      ></v-progress-linear>
    </div>
  </div>
  <NoData v-else />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"
import { usePagination } from "@/hooks/usePagination"

const tarteelStore = useTarteelStore()
const router = useRouter()
const store = useStore()

const tarteelContainer = ref(null)

const searchedTarteels = computed(() => tarteelStore.getStoredTarteels)
const ratl = computed(() => tarteelStore.getSelectedRatl)
const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)

const { paginatedItems, handleVirtualScroll, isLoading } = usePagination(
  computed(() => ratl.value?.verses || []),
  targetedVerseIndex
)

const handleSelectedVerse = (verse, tarteel) => {
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex,
    verseNumberToQuran: verse.verseNumberToQuran.toString(),
    tarteel,
  })
  router.push("sura")
}

const badges = computed(() => [
  {
    id: "count",
    color: "count",
    content: `${ratl.value.count || 0} مرة`,
    offsetX: "-60",
    offsetY: "20",
  },
  {
    id: "verse-count",
    color: "verse-count",
    content: `${ratl.value.verses.length} آية`,
    offsetX: "-15",
    offsetY: "20",
  },
])

const { setContainerHeight, dynamicHeight } = useWindow(tarteelContainer)
const { scrollToActiveItem } = useWindow()

const handleScrolling = () => {
  if (!tarteelContainer.value) return
  useResizeHandler({
    elementRef: tarteelContainer,
    elementFunc: setContainerHeight,
  })
  setContainerHeight()
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

<style></style>
