<template>
  <TableVerses
    class="web-kit-width"
    :verses="searchData"
    :versesInputText="inputText"
    @verseSelected="runSelectedSura"
  />
  <AppDialog
    v-model="showSuraText"
    :componentsToRender="[
      {
        component: AppChipsGroup,
        props: {
          chipsData: [inputText],
          deletable: false,
          selectedChipIndex: 0,
        },
      },
      { component: Sura, props: { suraInputText: inputText } },
    ]"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import Sura from "@/pages/Sura.vue"
import AppChipsGroup from "./AppChipsGroup.vue"

const props = defineProps(["searchData", "inputText", "suraInputText"])
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
