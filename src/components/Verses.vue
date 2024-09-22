<template>
  <TableVerses
    :tableData="verses"
    :tableVersesHeaders="tableVersesHeaders"
    :tableInputText="versesInputText"
    :verseQuranKey="verseQuranKey"
    :fieldPlaceHolder="versesInputText"
    @activateRowItem="handleVerseSelected"
  />
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const props = defineProps(["verses", "isLoading", "versesInputText"])
const emit = defineEmits(["verseSelected"])

const tableVersesHeaders = ref([
  {
    title: "السورة",
    key: "fileName",
    class: "brown lighten-5 black--text",
    width: "110",
    filterable: false,
  },
  {
    title: "رقم",
    key: "verseIndex",
    class: "brown lighten-5 black--text",
    width: "80",
  },
  { title: "الآية", key: "verseText", class: "brown lighten-5 black--text" },
  {
    title: "كلمات",
    key: "numberOfWords",
    class: "brown lighten-5 black--text",
    width: "85",
  },
  {
    title: "حروف",
    key: "numberOfLetters",
    class: "brown lighten-5 black--text",
    width: "85",
  },
  {
    title: "مصحف",
    key: "verseNumberToQuran",
    class: "brown lighten-5 black--text",
    width: "90",
  },
])

const verseQuranKey = computed(() => store.getTarget?.verseNumberToQuran)

const handleVerseSelected = (item) => {
  if (!item) return
  setTargetedSuraAndVerse(item)
  emit("verseSelected", item)
}

const setTargetedSuraAndVerse = (item) => {
  const suraNumber = item.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, "")
  const suraName = item.fileName.replace(/[0-9]/g, "")
  store.setTarget({
    fileName: `${suraNumber}${suraName}`,
    verseIndex: item.verseIndex,
    verseNumberToQuran: item.verseNumberToQuran,
  })
}
</script>
