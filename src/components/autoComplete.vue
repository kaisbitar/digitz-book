<template>
  <v-autocomplete
    v-model:search="search"
    :items="storedItems"
    :menu-props="{ maxWidth: '100%', maxHeight: '500px' }"
    item-value="verseNumberToQuran"
    item-title="verseText"
    label="ابحث  في الكتاب.."
    ref="autocompleteRef"
    clearable
    prepend-inner-icon="mdi-file-search"
    @keyup.enter="handleNewSearch"
    @click:option="(item) => handleNewSearch(item)"
    hide-details
    persistentClear
    autofocus
    menu
  >
    <template v-slot:no-data>
      <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
    </template>

    <template v-slot:selection> </template>

    <template v-slot:prepend-item class="search-count-header mt-n2">
      <SearchCountHeader
        class="search-count-header mt-n2"
        :searchQuery="search"
        :wordCount="wordCount"
        :resultsCount="resultsCount()"
        @newSearch="handleNewSearch"
      />
    </template>

    <template v-slot:item="{ item, props }">
      <div v-bind="props">
        <VerseDropMenu :item="item.raw" :textToHighlight="search" />
      </div>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const search = ref(null)
const autocompleteRef = ref(null)

const storedItems = computed(() => store.getOneQuranFile)
const searchResults = computed(() => store.getResearchResults)

const wordCount = computed(() => {
  if (!search.value || !autocompleteRef.value?.filteredItems) return 0
  const searchString = search.value.trim()
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

const resultsCount = () => {
  if (!autocompleteRef.value) return
  return autocompleteRef.value.filteredItems.length
}

const handleNewSearch = (value) => {
  if (!search.value) return
  store.setSearchIndex(searchResults.value.length)
  store.setResearchResults({
    wordCount: wordCount.value,
    resultsCount: autocompleteRef.value.filteredItems.length,
    inputText: search.value,
    result: autocompleteRef.value.filteredItems,
  })
  search.value = ""
}

onMounted(() => {})
</script>

<style>
.search-count-header {
  z-index: 5;
  background: rgb(var(--v-theme-surface));
}
</style>
