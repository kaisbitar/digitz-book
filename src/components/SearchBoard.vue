<template>
  <Research
    :chipsTitle="inputText"
    :chipsData="research"
    :selectedChipIndex="selectedChipIndex"
    @chipClicked="handleClickedChip"
    @chipRemoved="handleRemovedChip"
    @chipRemoveAll="handleResearchReset"
    closable
  />
  <TableVerses
    :verses="searchData"
    :versesInputText="inputText"
    @verseSelected="runSelectedSura"
  />
  <SearchSuraDialog v-model="showSuraText" :searchData="dialogData" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useCounting } from "@/mixins/counting"

const props = defineProps(["searchData", "inputText"])
const store = useQuranStore()
const { wordCount } = useCounting()

const showSuraText = ref(false)
const dialogData = ref({})

const research = computed(() => store.getResearchResults)
const selectedChipIndex = computed(() => store.getSelectedSearchIndex)
const tagetedSura = computed(() => store.getTarget)

const runSelectedSura = () => {
  dialogData.value = prepareDialogData(
    research.value[selectedChipIndex.value].verses
  )
  showSuraText.value = true
}

const prepareDialogData = (data) => {
  let suraSearchVerses = []
  data.forEach((element) => {
    if (element.raw.fileName === tagetedSura.value.fileName) {
      suraSearchVerses.push(element.raw)
    }
  })
  return {
    inputText: props.inputText,
    wordCount: wordCount(props.inputText, suraSearchVerses),
    versesCount: suraSearchVerses.length,
  }
}

const handleClickedChip = (index) => {
  store.setSearchIndex(index)
}

const handleRemovedChip = (index) => {
  store.setRemoveSearchItem(index)
  store.setSearchIndex(index - 1)
}

const handleResearchReset = () => {
  store.resetResearchResults()
}

onMounted(() => {
  if (selectedChipIndex.value === -1) {
    store.setSearchIndex(0)
  }
})
</script>

<style></style>
