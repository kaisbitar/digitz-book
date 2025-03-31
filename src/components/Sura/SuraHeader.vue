<template>
  <div class="d-flex justify-space-between">
    <!-- <v-btn
      class="float-end"
      @click="toggleToolbar"
      icon
      variant="tonal"
      size="small"
    >
      <v-icon>{{
        isToolbarExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-btn> -->
    <div>
      <span class="text-h4 ml-1">{{ suraNumber }}</span>
      <span class="text-h4 ml-4">{{ target.suraName }}</span>
      <AppHeaderMetrics :metrics="formattedMetrics" />
    </div>

    <v-btn
      icon="mdi-magnify"
      variant="tonal"
      size="small"
      @click="onSearchToggle"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { useStore } from "@/stores/appStore"

const dataStore = useDataStore()
const store = useStore()

const props = defineProps({
  title: String,
  showMetaData: Boolean,
  isInputVisible: Boolean,
  isToolbarExpanded: Boolean,
})

const emit = defineEmits(["expandedToggle", "searchToggle"])

const toggleToolbar = () => {
  emit("expandedToggle")
}

const onSearchToggle = () => {
  emit("searchToggle")
}

const tableQuranIndex = computed(() => dataStore.getQuranIndex)
const target = computed(() => store.getTarget)
const suraNumber = computed(() => {
  const numberPart = target.value.fileName
    .replace(/[ء-٩]/g, "")
    .replace(/\s/g, "")
  return parseInt(numberPart, 10).toString()
})

const suraKeyValues = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1]
)

import { useDisplay } from "vuetify"

const display = useDisplay()

const formattedMetrics = computed(() => {
  const allCounts = [
    { value: suraKeyValues.value.numberOfVerses, label: "أية" },
    { value: suraKeyValues.value.numberOfWords, label: "كلمة" },
    { value: suraKeyValues.value.numberOfLetters, label: "حرف" },
  ]

  return display.xs.value ? [allCounts[0]] : allCounts
})
</script>

<style scoped></style>
