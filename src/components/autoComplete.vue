<template>
  <!-- <v-autocomplete :items="storedItems" hide-details="" autofocus> -->
  <!-- </v-autocomplete> -->
  <v-autocomplete
    v-model:search="search"
    :items="storedItems"
    :menu-props="{ maxWidth: '100%' }"
    item-value="verseNumberToQuran"
    item-title="verseText"
    label="ابحث  في الكتاب.."
    ref="autocompleteRef"
    clearable
    active
    prepend-inner-icon="mdi-file-search"
    @keyup.enter="handleNewSearch"
    @click:option="(item) => handleNewSearch(item)"
    hide-details
    persistentClear
    menu
  >
    <template v-slot:no-data>
      <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
    </template>

    <template v-slot:selection> </template>
    <!-- <template v-slot:message>sd </template> -->

    <template v-slot:prepend-item>
      <!-- <v-sheet position="fixed" width="100%" class="mt-n2 mb-8" z-index="1000"> -->
      <SearchCountHeader
        class="search-count-header"
        :searchQuery="search"
        :wordCount="wordCount"
        :resultsCount="resultsCount()"
        @newSearch="handleNewSearch"
      />
      <!-- </v-sheet> -->
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props" class="mt-10">
        <!-- <VerseDropMenu :item="item.raw" :textToHighlight="search" /> -->
      </v-list-item>
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
  if (!search.value) {
    console.log(value)
    return
  }
  store.setSearchIndex(searchResults.value.length)
  store.setResearchResults({
    resultsCount: autocompleteRef.value.filteredItems.length,
    inputText: search.value,
    result: autocompleteRef.value.filteredItems,
  })
  search.value = ""
}

onMounted(() => {
  console.log(autocompleteRef.value)
  // if (autocompleteRef.value) {
  //   autocompleteRef.value.active = true // Open the menu on mount
  // }
})
</script>

<style>
.search-count-header {
  position: fixed;
  z-index: 5;
  background: rgb(var(--v-theme-surface));
}
</style>
