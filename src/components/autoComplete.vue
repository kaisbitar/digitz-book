<template>
  <div class="d-flex autoWrap webKitWidth">
    <v-autocomplete
      :filter="handleFiltering"
      v-model:search="search"
      :hide-no-data="!search"
      :disabled="isDisabled"
      :items="storedItems"
      @click:clear="handleRemoveAllChips()"
      @keyup.enter="handleNewSearch"
      prepend-inner-icon="mdi-magnify"
      item-value="verseNumberToQuran"
      item-title="verseText"
      label="ابحث  في الكتاب.."
      ref="autocompleteRef"
      class="autoBox"
      clearable
      flat
      density="compact"
      multiple
      variant="outlined"
    >
      <template v-slot:no-data>
        <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
      </template>

      <template v-slot:selection> </template>

      <template v-slot:prepend-inner>
        <div class="d-flex" @click.prevent="disableInputBox">
          <autoCompleteChipsBar
            :chipsData="searchResults"
            :selectedChipIndex="selectedSearchIndex"
            @chipClicked="handleClickedChip"
            @chipRemoved="handleRemovedChip"
          />
        </div>
        <appSearchBoxMatch
          :search="search"
          :matchingStatus="matchingStatus"
          @clicked="matchingStatus = !matchingStatus"
        />
      </template>

      <template v-slot:item="{ item, props }">
        <div v-bind="props">
          <autoCompleteItem
            :inputText="search"
            :item="item.raw"
            :chipTitle="' آية ' + item.raw.verseIndex"
            :subtitle="
              'ترتيب في المصحف:' + highlight(item.raw.verseNumberToQuran.toString(), search)
            "
            :mainText="highlight(item.raw.verseText, search)"
            :title="highlight(item.raw.fileName, search)"
            @clicked="handleSingleItemClicked(item.raw)"
          />
        </div>
      </template>

      <template v-slot:prepend-item>
        <autoCompleteOptionsBar
          class="btnsBar"
          @btn1Clicked="handleNewSearch()"
          :resultCounter="resultsCount()"
          :secondBtnCondition="selectedSearchIndex"
          :textValue="search"
          :btn1Title="'إبحث'"
          :btn2Title="'ضِف للبحث الحالي'"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import autoCompleteOptionsBar from './autoCompleteOptionsBar.vue'
import autoCompleteChipsBar from './autoCompleteChipsBar.vue'
import appSearchBoxMatch from './appSearchBoxMatch.vue'
import autoCompleteItem from './autoCompleteItem.vue'
import { useMixin } from '../mixins/mixins'

const store = useQuranStore()
const router = useRouter()

const isDisabled = ref(false)
const matchingStatus = ref(false)
const search = ref(null)
const autocompleteRef = ref(null)

const storedItems = computed(() => store.getOneQuranFile)
const selectedSearch = computed(() => store.getSelectedSearch)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const inputText = computed(() => selectedSearch.value?.inputText)
const searchResults = computed(() => store.getSearchResults)

const { highlight } = useMixin()

const handleClickedChip = index => {
  store.setSearchIndex(index)
  checkAndGo('search')
}

const handleRemovedChip = index => {
  store.setRemoveSearchItem(index)
  if (index !== selectedSearchIndex.value) {
    store.setSearchIndex(selectedSearchIndex.value - 1)
    return
  }
  store.setSearchIndex(index - 1)
  checkAndGo('search')
}

const handleRemoveAllChips = () => {
  store.setResetSearchResults()
  checkAndGo('singleSura')
}

const handleSingleItemClicked = item => {
  store.setTarget({
    fileName:
      item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '') + item.fileName.replace(/[0-9]/g, ''),
    verseIndex: item.verseIndex,
    verseNumberToQuran: item.verseNumberToQuran,
  })
  handleNewSearch()
}

const handleNewSearch = () => {
  if (!search.value) return
  setNewSearch()
  checkAndGo('search')
}

const setNewSearch = () => {
  store.setSearchIndex(searchResults.value.length)
  store.setSearchResultsItem({
    resultsCount: autocompleteRef.value.filteredItems.length,
    inputText: search.value,
    result: autocompleteRef.value.filteredItems,
  })
  disableInputBox()
}

const disableInputBox = () => {
  autocompleteRef.value.blur()
}

const handleFiltering = (item, queryText, itemText) => {
  search.value = queryText
  queryText = ' ' + queryText + ' '
  if (!matchingStatus.value && queryText.match(queryText) !== null) {
    return queryText
  }
  return queryText.match(new RegExp('([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)', 'gim'))
}

const resultsCount = () => {
  if (!autocompleteRef.value) return
  return autocompleteRef.value.filteredItems.length
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}

watch(inputText, newValue => {
  search.value = newValue
})

watch(selectedSearchIndex, newValue => {
  if (newValue === -1) return
  if (!selectedSearch.value) return
  search.value = inputText.value
  store.setTarget({
    fileName:
      selectedSearch.value.result[0].raw.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '') +
      selectedSearch.value.result[0].raw.fileName.replace(/[0-9]/g, ''),
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
  left: 3000px !important;
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
  padding-top: 20px;
  padding-bottom: 33px;
}
</style>
