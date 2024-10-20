<template>
  <v-row>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      :max-height="300"
      :max-width="1000"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="tarteel"
          v-bind="props"
          label="ترتيل القرآن"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          hide-details
          autofocus
          clearable
          :loading="isLoading"
          class="flex-grow-1"
        >
          <template #prepend-inner>
            <span class="text-caption mx-2">{{ wordsVariantsCount }}</span>
          </template>
        </v-text-field>
      </template>
      <AutoFilteredList
        :initial-items="filteredItems"
        @update:items="updateEditableItems"
        @save="saveChanges"
      />
    </v-menu>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useQuranStore } from "@/stores/app"
import { useTarteelStore } from "@/stores/TarteelStore"
import { filterItems } from "@/utils/autoWordFilter"

const store = useQuranStore()
const tarteelStore = useTarteelStore()

const tarteel = ref("")
const menu = ref(false)
const isLoading = ref(false)

const filteredItems = computed(() => {
  return filterItems(tarteel.value, store.getAllVersesNoTashkeel)
})

const editableFilteredItems = ref([])

watch(filteredItems, (newItems) => {
  editableFilteredItems.value = [...newItems]
})

watch(tarteel, (newValue) => {
  if (newValue && newValue.length > 0) {
    menu.value = true
  } else {
    menu.value = false
  }
})

const computedWordCount = computed(() =>
  countWordMatch(tarteel.value, editableFilteredItems.value)
)

const wordsVariantsCount = computed(() => {
  return editableFilteredItems.value.length
})

const updateEditableItems = (newItems) => {
  editableFilteredItems.value = newItems
}

const saveChanges = (items) => {
  tarteelStore.setTarteelResults({
    // wordCount: computedWordCount.value,
    wordsVariantsCount: wordsVariantsCount.value,
    inputText: tarteel.value,
    verses: items,
  })
  tarteelStore.addToTarteelHistory(tarteel.value)
  menu.value = false
}

const handleNewTarteel = (value) => {
  if (!tarteel.value) return
  tarteelStore.setSelectedTarteelIndex(tarteelStore.getTarteelResults.length)
  saveChanges(editableFilteredItems.value)
  tarteel.value = ""
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgb(var(--v-theme-background));
}
</style>
