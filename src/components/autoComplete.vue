<template>
  <div class="d-flex autoWrap webKitWidth">
    <v-autocomplete
      v-model="search"
      :filter="handleFiltering"
      :hide-no-data="!search"
      :disabled="isDisabled"
      :items="storedItems"
      @click:clear="handleRemoveAllChips()"
      @keyup.enter="handleNewSearch()"
      prepend-inner-icon="mdi-magnify"
      bg-color="#fff"
      item-value="verseNumberToQuran"
      item-text="verseText"
      color="blue-darken-4"
      label="ابحث  في الكتاب.."
      ref="autocomplete"
      class="autoBox"
      clearable
      flat
      density="compact"
      multiple
      variant="solo"
    >
      <template v-slot:no-data>
        <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
      </template>

      <template v-slot:selection> </template>

      <template v-slot:prepend-inner>
        <div class="d-flex" @click.prevent="disableInputBox()">
          <autoCompleteChipsBar
            :chipsData="SearchResults"
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
        <v-list-item v-bind="props">
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
        </v-list-item>
      </template>

      <template v-slot:prepend>
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

const store = useQuranStore()
const router = useRouter()

const isDisabled = ref(false)
const matchingStatus = ref(false)
const search = ref(null)
const autocomplete = ref(null)

const storedItems = computed(() => store.getOneQuranFile)
const selectedSearch = computed(() => store.getSelectedSearch)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const inputText = computed(() => selectedSearch.value?.inputText)
const SearchResults = computed(() => store.getSearchResults)

const handleClickedChip = index => {
  store.setSearchIndex(index)
  checkAndGo('search')
}

const handleRemovedChip = index => {
  store.setRremoveSearchItem(index)
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
  })
  handleNewSearch()
}

const handleNewSearch = () => {
  if (!search.value) return
  setNewSearch()
  checkAndGo('search')
}

const setNewSearch = () => {
  store.setSearchIndex(SearchResults.value.length)
  store.setSearchResultsItem({
    resultsCount: autocomplete.value.filteredItems.length,
    inputText: autocomplete.value.internalSearch,
    result: autocomplete.value.filteredItems,
  })
  disableInputBox()
}

const disableInputBox = () => {
  isDisabled.value = true
  setTimeout(() => {
    isDisabled.value = false
  }, 10)
  autocomplete.value.blur()
}

const handleFiltering = (item, queryText, itemText) => {
  itemText = ' ' + itemText + ' '
  if (!matchingStatus.value && itemText.match(queryText) !== null) {
    return itemText
  }
  return itemText.match(new RegExp('([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)', 'gim'))
}

const resultsCount = () => {
  if (!autocomplete.value) return
  return autocomplete.value.filteredItems.length.toString()
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}

const highlight = (text, search) => {
  // Implement your highlight logic here
  return text
}

watch(inputText, newValue => {
  search.value = newValue
})

watch(selectedSearchIndex, newValue => {
  if (newValue === -1) return
  search.value = inputText.value
  store.setTarget({
    fileName:
      selectedSearch.value.result[0].fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '') +
      selectedSearch.value.result[0].fileName.replace(/[0-9]/g, ''),
    verseIndex: selectedSearch.value.result[0].verseIndex,
  })
})

onMounted(() => {
  // Any mounted logic here
})
</script>

<style>
.autoWrap {
  margin-right: 39px;
}
.v-text-field__prefix {
  color: #b7b7b9;
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
  top: 0px;
  z-index: 1;
  background: white;
  height: 35px;
  padding-top: 11px;
  padding-bottom: 42px;
}
</style>
