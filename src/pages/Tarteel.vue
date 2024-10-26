<template>
  <div v-if="ratl && ratl.verses">
    <div class="d-flex mb-4">
      <div class="text-h4">{{ ratl.word }}</div>
      <v-badge
        color="count"
        :content="`${ratl.count || 0} مرة`"
        offset-x="-50"
        offset-y="20"
      ></v-badge>
      <v-badge
        color="verse-count"
        :content="`${ratl.verses.length} آية`"
        offset-x="-105"
        offset-y="20"
      ></v-badge>
    </div>

    <v-toolbar title="المعنى" class="" rounded density="compact"> </v-toolbar>
    <div
      ref="tarteelContainer"
      class="tarteel-container"
      :style="{ height: `${dynamicHeight}px`, overflowY: 'auto' }"
      @scroll="handleScroll"
    >
      <template
        v-for="(verse, index) in displayedItems"
        :key="index"
        style="height: 1px"
      >
        <VerseCardItem
          :item="verse"
          :index="index"
          :textToHighlight="ratl.word"
          :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
          :class="{
            'active-verse-text':
              parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
          }"
          @click="handleSelectedVerse(verse, ratl.word)"
        />
      </template>
      <div v-if="isLoading" class="text-center my-2">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </div>
  </div>
  <NoData v-else />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

const tarteelContainer = ref(null)
const { setContainerHeight, dynamicHeight } = useWindow(tarteelContainer)
const { scrollToActiveItem } = useWindow()

const tarteelStore = useTarteelStore()
const router = useRouter()
const store = useStore()
const ratl = computed(() => {
  const selectedRatl = tarteelStore.getSelectedRatl
  return selectedRatl && selectedRatl.verses ? selectedRatl : null
})
const selectedItem = ref(null)

const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)
const handleSelectedVerse = (verse, tarteel) => {
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex,
    verseNumberToQuran: verse.verseNumberToQuran.toString(),
    tarteel,
  })
  router.push("sura")
}

const fetchVerses = (page, itemsPerPage) => {
  if (!ratl.value || !ratl.value.verses) return []

  const start = (page - 1) * itemsPerPage
  const end = page * itemsPerPage
  return ratl.value.verses.slice(start, end)
}

const activeVerse = computed(() => {
  if (!targetedVerseIndex.value || !ratl.value?.verses) return null
  return ratl.value.verses.find(
    (v) => v.verseNumberToQuran === parseInt(targetedVerseIndex.value)
  )
})

const {
  displayedItems,
  isLoading,
  allItemsLoaded,
  handleScroll,
  loadMoreItems,
  loadPageContainingItem,
} = useInfiniteScroll(fetchVerses, {
  itemsPerPage: 100,
  initialActiveItem: activeVerse.value,
})

onMounted(async () => {
  console.log(ratl.value)
  await nextTick()
  if (!tarteelContainer.value) return

  useResizeHandler({
    elementRef: tarteelContainer,
    elementFunc: setContainerHeight,
  })
  setContainerHeight()
})

watch(
  activeVerse,
  async (newActiveVerse) => {
    if (newActiveVerse) {
      await loadPageContainingItem(newActiveVerse)
      await nextTick()
      scrollToActiveItem(".active-verse-text", ".tarteel-container")
    }
  },
  { immediate: true }
)
</script>

<style></style>
