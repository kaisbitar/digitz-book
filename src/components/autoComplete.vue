<template>
  <AppInputField
    v-model="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${wordsVariantsCount} كلمة`"
    :type="'verseCount'"
    @update:modelValue="onInput"
    @clear="clearInput"
    @focus="onFocus"
  >
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
      transition="fade-transition"
      :max-height="'auto'"
      :max-width="1000"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props"></div>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>ترتيل {{ tarteel }}..</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <AutoFilteredWords
            v-if="tarteeledWords.length > 2"
            ref="FilteredWordsList"
            :items="tarteeledWords"
            :total-count="totalWordsCount"
            @update:items="updateEditableItems"
          />
          <v-lazy
            v-else
            transition="fade-transition"
            :options="{
              threshold: 0.5,
            }"
          >
            <AutoFilteredLetters />
          </v-lazy>
        </v-list-item>
      </v-list>
    </v-menu>
  </AppInputField>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { filterWords } from "@/utils/autoWordFilter"
import { useWindow } from "@/mixins/window"
import AppInputField from "./AppInputField.vue"
import AutoFilteredLetters from "./AutoFilteredLetters.vue"

const store = useStore()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const tarteel = ref("")
const menu = ref(false)
const isLoading = ref(false)

const filteredItems = computed(() => {
  if (!tarteel.value) {
    return { results: [], totalCount: 0 }
  }
  if (tarteel.value.length > 1) {
    return filterWords(tarteel.value, dataStore.getVersesForCounting)
  }
  return { results: [], totalCount: 0 }
})

const tarteeledWords = ref([])
const totalWordsCount = ref(0)

watch(
  () => filteredItems.value,
  (newFilteredItems) => {
    tarteeledWords.value = newFilteredItems.results.map((item) => ({
      word: item.word,
      count: item.count,
    }))
    totalWordsCount.value = newFilteredItems.totalCount
  },
  { immediate: true }
)

const { scrollToActiveItem } = useWindow()
const FilteredWordsList = ref(null)

const updateEditableItems = (newItems) => {
  tarteeledWords.value = newItems
}

const onInput = (value) => {
  tarteel.value = value
  if (value && value.length > 0) {
    menu.value = true
  }
}

const onFocus = () => {
  menu.value = true
}

const clearInput = () => {
  tarteel.value = ""
  menu.value = false
  tarteeledWords.value = []
  totalWordsCount.value = 0
}

const wordsVariantsCount = computed(() => {
  return totalWordsCount.value
})

onMounted(() => {})
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgb(var(--v-theme-background));
}
</style>

<!-- const scrollToTop = () => {
  nextTick(() => {
    if (FilteredWordsList.value) {
      const listElement = FilteredWordsList.value.$el.querySelector(".v-list")
      if (listElement) {
        listElement.scrollTop = 0
      }
    }
    scrollToActiveItem(".active-verse-text", ".sura-text-container")
  })
} -->
<!-- 

const saveChanges = () => {
  tarteelStore.setTarteelResults({
    wordsVariantsCount: totalWordsCount.value,
    inputText: tarteel.value,
    verses: FilteredWordsList.value.results,
  })
  tarteelStore.addToTarteelHistory(tarteel.value)
  menu.value = false
} -->
