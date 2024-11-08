<template>
  <Table
    v-if="!isMobileView"
    class="verses-overview mt-1"
    activeItemClass="active-verse-table"
    :tableHeight="'calc(100vh - 64px - 48px - 110px)'"
    :tableData="paginatedItems"
    :tableHeaders="versesHeaders"
    :tableInputText="versesInputText"
    :activeItemKey="String(targetedVerseIndex)"
    @rowClicked="handleVerseSelected"
    @scroll="handleInfiniteScroll"
  />
  <TableMobile
    v-else
    class="verses-overview"
    :data="paginatedItems"
    :tableInputText="versesInputText"
    :activeItemKey="String(targetedVerseIndex)"
    @rowClicked="handleVerseSelected"
    @scroll="handleInfiniteScroll"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useWindow } from "@/mixins/window"
import { useIndexedPagination } from "@/hooks/useIndexedPagination"

const { scrollToActiveItem } = useWindow()

const store = useStore()

const props = defineProps(["verses", "versesInputText"])
const emit = defineEmits(["verseSelected"])

const isMobileView = computed(() => store.getVersesMobileView)

const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)

const { paginatedItems, handleInfiniteScroll, isLoading } =
  useIndexedPagination(
    computed(() => props.verses || []),
    targetedVerseIndex
  )

const handleVerseSelected = (item) => {
  if (!item) return
  emit("verseSelected", item)
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

watch(targetedVerseIndex, () => {
  tablesScroll()
  handleInfiniteScroll()
})

onMounted(async () => {
  await nextTick()
  tablesScroll()
  handleInfiniteScroll()
})
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
  {
    title: "مرقوم",
    key: "verseValue",
    width: "20px",
  },
])
</script>

<style scoped></style>
