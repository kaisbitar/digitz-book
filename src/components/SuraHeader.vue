<template>
  <div class="d-flex">
    <span class="text-h4 ml-1">{{ suraNumber }}</span>
    <span class="text-h4 ml-4">{{ target.suraName }}</span>
    <AppMetaData :metaData="suraMetaData" />
  </div>
</template>

<script setup>
import AppMetaData from "./AppMetaData.vue"
import { computed, onMounted, ref } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { useStore } from "@/stores/appStore"

const dataStore = useDataStore()
const store = useStore()
const props = defineProps({
  title: String,
  showMetaData: Boolean,
})

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

const suraMetaData = computed(() => ({
  آية: { value: suraKeyValues.value.numberOfVerses },
  كلمة: { value: suraKeyValues.value.numberOfWords },
  حرف: { value: suraKeyValues.value.numberOfLetters },
}))

onMounted(() => {
  // setSuraBasics()
})
</script>

<style scoped></style>
