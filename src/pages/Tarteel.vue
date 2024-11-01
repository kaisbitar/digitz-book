<template>
  <!-- <TarteelChart :series="ratl" /> -->
  <div
    v-if="ratl && ratl.verses"
    class="d-flex flex-column h-100 pa-0 pt-4 px-4"
  >
    <div class="d-flex mb-2">
      <span class="text-h4 ml-4">{{ ratl.word }}</span>

      <span class="text-h4 mr-3 count-key-item">
        {{ ratl.verses.length }}
        <span class="text-caption mr-n1 count-key-item">آية</span>
      </span>

      <span class="text-h4 mr-3 count-key-item">
        {{ ratl.count }}
        <span class="text-caption mr-n1 count-key-item">مرة</span>
      </span>

      <v-btn
        icon="mdi-chevron-down"
        elevation="0"
        class="mr-auto"
        @click="expanded = !expanded"
      >
      </v-btn>
    </div>

    <v-card
      hover
      variant="plain"
      elevation="1"
      class="pa-2"
      :class="expanded ? 'tarteel-overflow' : 'fixed-height'"
      @click="expanded = !expanded"
    >
      <TarteelWordMeaning
        :word="ratl.word"
        :expanded="expanded"
        :class="expanded ? 'tarteel-meaning-overflow' : 'fixed-height'"
      />
    </v-card>

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
      <v-progress-linear
        v-if="isLoading"
        :height="4"
        color="verse-count"
        indeterminate
        rounded
      ></v-progress-linear>
      <div class="mt-5 mb-3 text-center">صدق الله العظيم</div>
    </div>
  </div>

  <template v-else>
    <NoData />
  </template>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { usePagination } from "@/hooks/usePagination"

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

// const badges = computed(() => [
//   {
//     id: "count",
//     color: "count",
//     content: `${ratl.value.count || 0} مرة`,
//     offsetX: "-60",
//     offsetY: "20",
//   },
//   {
//     id: "verse-count",
//     color: "verse-count",
//     content: `${ratl.value.verses.length} آية`,
//     offsetX: "-15",
//     offsetY: "20",
//   },
// ])
</script>

<style scoped>
.fixed-height {
  height: 85px; /* or whatever height you prefer */
  overflow: hidden;
}
</style>
