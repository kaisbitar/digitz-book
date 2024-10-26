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
    >
      <template
        v-for="verse in ratl.verses"
        :key="verse.index"
        style="height: 1px"
      >
        <VerseCardItem
          :item="verse"
          :textToHighlight="ratl.word"
          :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
          :class="{
            'active-verse-text':
              parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
          }"
          @click="handleSelectedVerse(verse, ratl.word)"
        />
      </template>
    </div>
  </div>
  <v-container v-else class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-icon
          icon="mdi-book-open-page-variant"
          size="x-large"
          color="primary"
          class="mb-4"
        ></v-icon>
        <v-card elevation="2" class="pa-4">
          <v-card-text class="text-h6"> ورتل القرآن ترتيلا.. </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

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

onMounted(async () => {
  await nextTick()
  if (tarteelContainer.value) {
    useResizeHandler({
      elementRef: tarteelContainer,
      elementFunc: setContainerHeight,
    })
    setContainerHeight()
    scrollToActiveItem(".active-verse-text", ".tarteel-container")
  }
})
</script>

<style></style>
