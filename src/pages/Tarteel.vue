<template>
  <div class="d-flex mb-4">
    <div class="text-h4">{{ ratl.word }}</div>
    <v-badge
      color="count"
      :content="`${ratl.count} مرة`"
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
        @click="handleSelectedVerse(verse, ratl.word)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

const tarteelContainer = ref(null)
const { setContainerHeight, dynamicHeight } = useWindow(tarteelContainer)

const tarteelStore = useTarteelStore()
const router = useRouter()
const store = useStore()
const ratl = computed(() => tarteelStore.getSelectedRatl)

const handleSelectedVerse = (verse, tarteel) => {
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex,
    verseNumberToQuran: verse.verseNumberToQuran.toString(),
    tarteel,
  })
  router.push("sura")
}

useResizeHandler({
  elementRef: tarteelContainer,
  elementFunc: setContainerHeight,
})

onMounted(async () => {
  await nextTick()
  setContainerHeight()
})
</script>

<style></style>
