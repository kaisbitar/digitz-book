<template>
  <!-- <v-autocomplete
    v-model:search="search"
    :items="oneQuranFile"
    density="compact"
  /> -->
  <v-autocomplete
    v-model:search="search"
    :items="oneQuranFile"
    :menu-props="{ maxWidth: '100%', maxHeight: '500px' }"
    item-value="verseNumberToQuran"
    item-title="verseText"
    label="ابحث  في المصحف.."
    ref="autocompleteRef"
    clearable
    append-inner-icon="mdi-magnify"
    @keyup.enter="handleNewSearch"
    @click:option="(item) => handleNewSearch(item)"
    hide-details
    persistentClear
    autofocus
    density="compact"
  >
    <template v-slot:no-data>
      <p class="pa-1 text-red">لا يوجد معلومات تطابق البحث!</p>
    </template>

    <template v-slot:selection> </template>

    <template v-slot:prepend-item>
      <div class="mb-10 mr-5">
        <v-row class="position-fixed z-10">
          <v-btn @click="handleNewSearch" variant="tonal">ابحث</v-btn> "{{
            search
          }}"
          <AppCountChips
            :wordCount="computedWordCount"
            :versesCount="versesCount()"
            :labels="{ word: 'مرة', verse: 'آية' }"
          />
        </v-row>
      </div>
    </template>

    <template v-slot:item="{ item, index, props }">
      <!-- <v-virtual-scroll :items="filteredItems" height="500px" item-height="64">
        <template v-slot:default="{ item, index }">
          <v-lazy
            v-intersect="{
              handler: onIntersect,
              options: {
                threshold: 0.5,
              },
            }"
            :key="item.verseNumberToQuran"
            min-height="64"
          > -->
      {{ item.raw.verseText }}
      <!-- <VerseCardItem
        class="mr-5"
        :index="index"
        :item="item.raw"
        :textToHighlight="search"
        @click="handleItemClick(item)"
      /> -->
      <!-- </v-lazy>
        </template>
      </v-virtual-scroll> -->
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

const oneQuranFile = computed(() => store.getOneQuranFile)
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

const handleItemClick = (item) => {
  handleNewSearch(item)
  // Close the autocomplete menu if needed
  if (autocompleteRef.value) {
    autocompleteRef.value.closeMenu()
  }
}

const visibleItems = ref(20)
const itemIncrement = 10

const filteredItems = computed(() => {
  if (!autocompleteRef.value?.filteredItems) return []
  return autocompleteRef.value.filteredItems.slice(0, visibleItems.value)
})

const onIntersect = (entries, observer) => {
  if (entries && entries.length > 0 && entries[0].isIntersecting) {
    visibleItems.value += itemIncrement
  }
}

onMounted(() => {})
</script>

<style scoped></style>
