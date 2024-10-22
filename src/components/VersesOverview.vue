<template>
  <Table
    v-if="!isMobileView"
    class="verses-overview"
    activeItemClass="active-verse-table"
    :tableData="verses"
    :tableHeaders="versesHeaders"
    :tableInputText="versesInputText"
    :activeItemKey="String(targetedIndex)"
    @rowClicked="handleVerseSelected"
  />
  <TableMobile
    v-else
    class="verses-overview"
    :data="verses"
    :tableInputText="versesInputText"
    :activeItemKey="String(targetedIndex)"
    @rowClicked="handleVerseSelected"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useWindow } from "@/mixins/window"

const { scrollToActiveItem } = useWindow()

const store = useStore()

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

const versesContainer = computed(() =>
  isMobileView.value ? ".verses-overview" : ".verses-overview .v-table__wrapper"
)
const tablesScroll = async () => {
  await nextTick()
  scrollToActiveItem(".active-verse-table", versesContainer.value)
}

defineExpose({ tablesScroll })

watch(isMobileView, tablesScroll)

onMounted(() => {
  tablesScroll()
})
</script>

<style scoped></style>
