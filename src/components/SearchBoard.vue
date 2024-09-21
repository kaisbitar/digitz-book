<template>
  <Verses
    class="web-kit-width"
    :verses="searchData"
    :inputText="inputText"
    @verseSelected="runSelectedSura"
  />
  <AppScreenDialog
    v-model="showSuraText"
    :componentToRender="Sura"
    :componentProps="{ inputText }"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import Sura from "@/pages/Sura.vue"

const props = defineProps(["searchData", "inputText"])
const store = useQuranStore()

const suraTextArray = ref([])
const showSuraText = ref(false)

const oneQuranFile = computed(() => store.getOneQuranFile)

const runSelectedSura = (verse) => {
  const fileName = verse.fileName
  suraTextArray.value = []
  oneQuranFile.value.forEach((item) => {
    if (item.fileName === fileName) {
      suraTextArray.value.push(item.verseText)
    }
  })
  showSuraText.value = true
}

onMounted(() => {})
</script>

<style></style>
