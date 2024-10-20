<template>
  <AppInputField
    v-model="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${wordsVariantsCount} كلمة`"
    :type="'verseCount'"
    @update:modelValue="onInput"
    @clear="clearInput"
    @focus="menu = true"
  >
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      :max-height="300"
      :max-width="1000"
      location="bottom"
      :activator="'parent'"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title>ترتيل {{ tarteel }}..</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <AutoFilteredList
          v-if="tarteeledWords.length > 0"
          ref="autoFilteredList"
          :items="tarteeledWords"
          :total-count="totalWordsCount"
          @update:items="updateEditableItems"
          @save="saveChanges"
        />
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
  return filterWords(tarteel.value, dataStore.getVersesForCounting)
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
const autoFilteredList = ref(null)

const onInput = async (value) => {
  if (value && value.length > 0) {
    menu.value = true
    await nextTick()
    // scrollToTop()
  } else {
    menu.value = false
    tarteeledWords.value = []
    totalWordsCount.value = 0
  }
}

const clearInput = () => {
  tarteel.value = ""
  menu.value = false
  tarteeledWords.value = []
  totalWordsCount.value = 0
}

const onClickOutside = () => {
  if (menu.value) {
    menu.value = false
  }
}

const scrollToTop = () => {
  nextTick(() => {
    if (autoFilteredList.value) {
      const listElement = autoFilteredList.value.$el.querySelector(".v-list")
      if (listElement) {
        listElement.scrollTop = 0
      }
    }
    scrollToActiveItem(".active-verse-text", ".sura-text-container")
  })
}

const wordsVariantsCount = computed(() => {
  return totalWordsCount.value
})

const updateEditableItems = (newItems) => {
  tarteeledWords.value = newItems
}

const saveChanges = () => {
  tarteelStore.setTarteelResults({
    wordsVariantsCount: totalWordsCount.value,
    inputText: tarteel.value,
    verses: autoFilteredList.value.results,
  })
  tarteelStore.addToTarteelHistory(tarteel.value)
  menu.value = false
}

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
