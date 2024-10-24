<template>
  <div class="mb-4">
    <span class="text-h4 ml-4"
      >{{ selectedTarteel.inputText }}
      <v-badge
        :content="`${selectedTarteel.results.length} مشتق`"
        color="word-count"
        offset-x="5"
        offset-y="0"
        inline
      ></v-badge
    ></span>
  </div>
  <v-toolbar>
    <AppInputField
      :fieldInput="search"
      :fieldPlaceHolder="`${search}`"
      @update:fieldInput="updateSearchValue"
    />
  </v-toolbar>
  <TarteelResultsView :selected-tarteel="selectedTarteel" />
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"
import AppInputField from "./AppInputField.vue"
import { useTarteelStore } from "@/stores/tarteelStore"
const { updateSearchValue, search } = useInputFiltering()

const props = defineProps(["searchData", "inputText"])
const tarteelStore = useTarteelStore()

const storedTarteels = computed(() => tarteelStore.getStoredTarteels)
const selectedTarteelIndex = computed(
  () => tarteelStore.getSelectedTarteelIndex
)
const selectedTarteel = computed(
  () => storedTarteels.value[selectedTarteelIndex.value]
)

onMounted(() => {
  console.log(selectedTarteel.value)
})
</script>

<style></style>
