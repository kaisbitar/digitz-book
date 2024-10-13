<template>
  <Research :chipsTitle="inputText" :chipsData="research" />
  <v-card variant="outlined">
    <v-toolbar>
      <AppInputFieldToggle
        :fieldInput="search"
        :fieldPlaceHolder="`${search}`"
        @update:fieldInput="updateSearchValue"
      />
    </v-toolbar>
    <TableVerses
      :verses="searchData"
      :versesInputText="search"
      @verseSelected="runSelectedSura"
    />
  </v-card>
  <SearchSuraDialog v-model="showSura" :searchData="dialogData" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useCounting } from "@/mixins/counting"
import { useInputFiltering } from "@/mixins/inputFiltering"
const { updateSearchValue, search } = useInputFiltering()

const props = defineProps(["searchData", "inputText"])
const store = useQuranStore()
const { countWordMatch } = useCounting()

const showSura = ref(false)
const dialogData = ref({})

const research = computed(() => store.getResearchResults)
const selectedChipIndex = computed(() => store.getSelectedSearchIndex)
const tagetedSura = computed(() => store.getTarget)

const handleShowVersesMobileView = () => {
  store.setVersesMobileView(!store.getVersesMobileView)
}

const runSelectedSura = () => {
  store.setIsDialog(true)
  dialogData.value = prepareDialogData(
    research.value[selectedChipIndex.value].verses
  )
  showSura.value = true
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
    wordCount: countWordMatch(props.inputText, suraSearchVerses),
    versesCount: suraSearchVerses.length,
  }
}
watch(selectedChipIndex, () => {
  search.value = props.inputText
})

watch(showSura, (value) => {
  if (!value) store.setIsDialog(false)
})
onMounted(() => {
  search.value = props.inputText
  if (selectedChipIndex.value === -1) {
    store.setSearchIndex(0)
  }
})
</script>

<style></style>
