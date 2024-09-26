<template>
  <Research :chipsTitle="inputText" :chipsData="research" />
  <AppInputField
    :fieldInput="search"
    :fieldPlaceHolder="inputText"
    @update:fieldInput="updateSearchValue"
  />
  <TableVerses
    :verses="searchData"
    :versesInputText="search"
    @verseSelected="runSelectedSura"
  />
  <SearchSuraDialog v-model="showSuraText" :searchData="dialogData" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useCounting } from "@/mixins/counting"
import { useInputFiltering } from "@/mixins/inputFiltering"
const { updateSearchValue, search } = useInputFiltering()

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
watch(selectedChipIndex, () => {
  console.log(props.inputText.value)
  search.value = props.inputText
})

onMounted(() => {
  search.value = props.inputText
  if (selectedChipIndex.value === -1) {
    store.setSearchIndex(0)
  }
})
</script>

<style></style>
