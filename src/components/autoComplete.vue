<template>
  <v-autocomplete
    :custom-filter="handleFiltering"
    v-model:search="search"
    :items="storedItems"
    @keyup.enter="handleNewSearch"
    item-value="verseNumberToQuran"
    item-title="verseText"
    label="ابحث  في الكتاب.."
    ref="autocompleteRef"
    clearable
    multiple
    variant="outlined"
  >
    <template v-slot:no-data>
      <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
    </template>

    <template v-slot:selection> </template>
    <template v-slot:item="{ item, props }">
      <div v-bind="props">
        <AutoCompleteItem
          :item="item.raw"
          :chipTitle="' آية ' + item.raw.verseIndex"
          :subtitle="
            'ترتيب في المصحف:' +
            highlight(item.raw.verseNumberToQuran.toString(), search)
          "
          :mainText="highlight(item.raw.verseText, search)"
          :title="highlight(item.raw.fileName, search)"
          @clicked="handleSingleItemClicked(item.raw)"
        />
      </div>
    </template>

    <template v-slot:prepend-item>
      <SearchCountHeader
        :searchQuery="search"
        :wordCount="wordCount"
        :resultsCount="resultsCount()"
        @newSearch="handleNewSearch"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useMixin } from "../mixins/mixins"
import { useInputFiltering } from "../mixins/inputFiltering"

const { handleFiltering } = useInputFiltering()
const { highlight } = useMixin()
const emit = defineEmits(["matchChanged"])
const props = defineProps(["fieldPlaceHolder"])
const store = useQuranStore()

const search = ref(null)
const autocompleteRef = ref(null)

const storedItems = computed(() => store.getOneQuranFile)
const selectedSearch = computed(() => store.getSelectedSearch)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const inputText = computed(() => selectedSearch.value?.inputText)
const searchResults = computed(() => store.getResearchResults)
const wordCount = computed(() => {
  if (!search.value || !autocompleteRef.value?.filteredItems) return 0

  const searchString = search.value
  // .trim()
  let count = 0

  autocompleteRef.value.filteredItems.forEach((item) => {
    const text = item.raw.verseText
    const regex = new RegExp(searchString, "gi")
    const matches = text.match(regex)
    if (matches) {
      count += matches.length
    }
  })

  return count
})

const handleSingleItemClicked = (item) => {
  store.setTarget({
    fileName:
      item.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, "") +
      item.fileName.replace(/[0-9]/g, ""),
    verseIndex: item.verseIndex,
    verseNumberToQuran: item.verseNumberToQuran,
  })
  handleNewSearch()
}

const handleNewSearch = () => {
  if (!search.value) return
  store.setSearchIndex(searchResults.value.length)
  store.setResearchResultsItem({
    resultsCount: autocompleteRef.value.filteredItems.length,
    inputText: search.value,
    result: autocompleteRef.value.filteredItems,
  })
  search.value = ""
}

const resultsCount = () => {
  if (!autocompleteRef.value) return
  return autocompleteRef.value.filteredItems.length
}

watch(inputText, (newValue) => {
  search.value = newValue
})

watch(selectedSearchIndex, (newValue) => {
  if (newValue === -1) return
  if (!selectedSearch.value) return
  search.value = inputText.value
  store.setTarget({
    fileName:
      selectedSearch.value.result[0].raw.fileName
        .replace(/[ء-٩]/g, "")
        .replace(/\s/g, "") +
      selectedSearch.value.result[0].raw.fileName.replace(/[0-9]/g, ""),
    verseIndex: selectedSearch.value.result[0].verseIndex,
    verseNumberToQuran: selectedSearch.value.result[0].verseNumberToQuran,
  })
})

onMounted(() => {
  // Any mounted logic here
})
</script>

<style>
.autoWrap {
  zoom: 1.1;
}
.v-overlay__content {
  /* left: 3000px !important; */
}
.v-text-field__prefix {
  font-size: 16px;
  margin-top: 9px;
}
.v-select__selections input {
  padding-top: 18px !important;
}
.searchLabel {
  padding-top: 2px;
  border-radius: 4px !important;
  margin-top: -7px;
  padding-bottom: 6px;
}
.btnsBar {
  position: sticky;
  top: -8px;
  z-index: 1;
  height: 35px;
  /* padding-top: 20px;
    padding-bottom: 33px; */
}
</style>
