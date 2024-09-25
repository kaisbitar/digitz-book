<template>
  <SearchChipsGroup
    :chipsTitle="inputText"
    :chipsData="researchTitles"
    :selectedChipIndex="selectedSearchIndex"
    @chipClicked="handleClickedChip"
    @chipRemoved="handleRemovedChip"
    @chipRemoveAll="handleResearchReset"
    closable
  />
  <TableVerses
    class="web-kit-width"
    :verses="searchData"
    :versesInputText="inputText"
    @verseSelected="runSelectedSura"
  />
  <SearchSuraDialog
    v-model="showSuraText"
    :inputText="inputText"
    :componentsToRender="componentsToRender"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import Sura from "@/pages/Sura.vue"
import SearchChipsGroup from "./SearchChipsGroup.vue"

const props = defineProps(["searchData", "inputText", "suraInputText"])
const store = useQuranStore()

const suraTextArray = ref([])
const showSuraText = ref(false)

const oneQuranFile = computed(() => store.getOneQuranFile)
const research = computed(() => store.getResearchResults)
const researchTitles = computed(() =>
  research.value.map((raw) => raw.inputText)
)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)

const componentsToRender = computed(() => {
  return [
    {
      component: SearchChipsGroup,
      props: {
        chipsData: [props.inputText],
        deletable: false,
        selectedChipIndex: 0,
      },
    },
    { component: Sura, props: { suraInputText: props.inputText } },
  ]
})

const runSelectedSura = (verse) => {
  const fileName = verse.fileName
  suraTextArray.value = []
  oneQuranFile.value.forEach((item) => {
    if (item.fileName === fileName) {
      suraTextArray.value.push(item.verseText)
    }
  })
  showSuraText.value = true
}

const handleClickedChip = (index) => {
  store.setSearchIndex(index)
}

const handleRemovedChip = (index) => {
  if (index !== selectedSearchIndex.value) {
    store.setSearchIndex(Math.max(selectedSearchIndex.value - 1, 0))
  } else {
    store.setRemoveSearchItem(index)
    store.setSearchIndex(Math.max(index - 1, 0))
  }
}

const handleResearchReset = () => {
  store.resetResearchResults()
}

onMounted(() => {
  if (selectedSearchIndex.value === -1) {
    store.setSearchIndex(0)
  }
})
</script>

<style></style>
