<template>
  <v-autocomplete
    v-model:search="search"
    :items="OneQuranFile"
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

    <template v-slot:prepend-item class="d-flex search-count-header mt-n2">
      <v-container
        ><v-btn @click="handleNewSearch" variant="tonal">ابحث</v-btn> "{{
          search
        }}"
        <AppCountChips
          :wordCount="computedWordCount"
          :versesCount="versesCount()"
      /></v-container>
    </template>

    <template v-slot:item="{ item, index, props }">
      <v-list v-bind="props">
        <VerseSummary
          class="mr-5"
          @click="handleNewSearch"
          :index="index"
          :item="item.raw"
          :textToHighlight="search"
        />
      </v-list>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useCounting } from "@/mixins/counting"

const store = useQuranStore()
const search = ref(null)
const { countWordMatch } = useCounting()
const autocompleteRef = ref(null)

const OneQuranFile = computed(() => store.getOneQuranFile)
const searchResults = computed(() => store.getResearchResults)

const computedWordCount = computed(() =>
  countWordMatch(search.value, extractVersesFromFilter(autocompleteRef.value))
)
const extractVersesFromFilter = (data) => {
  if (!data?.filteredItems) return []
  return data.filteredItems.map((item) => item.raw)
}
const versesCount = () => {
  if (!autocompleteRef.value) return
  return autocompleteRef.value.filteredItems.length
}

const handleNewSearch = (value) => {
  if (!search.value) return
  store.setSearchIndex(searchResults.value.length)
  store.setResearchResults({
    wordCount: computedWordCount.value,
    versesCount: versesCount(),
    inputText: search.value,
    verses: autocompleteRef.value.filteredItems,
  })
  search.value = ""
}

onMounted(() => {})
</script>

<style scoped>
.search-count-header {
  z-index: 5;
}
.v-list.v-theme--dark.v-list--density-default.v-list--one-line {
  background: rgb(var(--v-theme-second-background));
}
</style>
