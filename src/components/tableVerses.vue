<template>
  <Table
    v-if="!isMobileView"
    :tableData="verses"
    :tableHeaders="versesHeaders"
    :tableInputText="versesInputText"
    :scrollingContainerClass="'verses-container'"
    :scrollingItemClass="'active-verse'"
    :activeItemKey="String(targetedIndex)"
    @activateRowItem="handleVerseSelected"
  />
  <TableMobile
    v-else
    :data="filteredVerses"
    :tableInputText="versesInputText"
    :activeItemKey="String(targetedIndex)"
    :scrollingContainerClass="'verses-container'"
    :scrollingItemClass="'active-verse'"
    @activateRowItem="handleVerseSelected"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"

const { scrollToActiveItem } = useWindow()

const store = useQuranStore()

const props = defineProps(["verses", "versesInputText"])
const emit = defineEmits(["verseSelected"])

const versesHeaders = ref([
  {
    title: "Index",
    key: "index",
  },
  {
    title: "السورة",
    key: "suraName",
    width: "20px",
  },
  {
    title: "رقم",
    key: "verseIndex",
    width: "20px",
  },
  { title: "الآية", key: "verseText", width: "1200px" },
  {
    title: "كلمات",
    key: "numberOfWords",
    width: "20px",
  },
  {
    title: "حروف",
    key: "numberOfLetters",
    width: "20px",
  },
  {
    title: "مصحف",
    key: "verseNumberToQuran",
    width: "20px",
  },
])

const isMobileView = computed(() => store.getVersesMobileView)
const activeSuraTab = computed(() => store.getActiveSuraTab)

const filteredVerses = computed(() => {
  if (!props.versesInputText) return props.verses
  return props.verses
    .filter((verse) => verse.verseText.includes(props.versesInputText))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const targetedIndex = computed(() => {
  return (
    store.getTarget?.verseNumberToQuran ??
    (props.verses.length > 0 ? props.verses[0].verseNumberToQuran : "1")
  )
})
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

const tableScrollClasses = computed(() =>
  isMobileView.value
    ? ".verses-container"
    : ".verses-container .v-table__wrapper"
)
const tablesScroll = () => {
  console.log(tableScrollClasses.value)
  scrollToActiveItem(".active-verse", tableScrollClasses.value)
}

defineExpose({ tablesScroll })

watch(isMobileView, tablesScroll)
watch(activeSuraTab, tablesScroll)

onMounted(() => {
  tablesScroll()
})
</script>

<style scoped></style>
