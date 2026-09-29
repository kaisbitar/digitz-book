<template>
  <TableMobile
    :data="paginatedItems"
    :tableInputText="items[0]?.word"
    @scroll="handleInfiniteScroll"
    @rowClicked="handleVerseClick"
  />
</template>

<script setup>
import { useIndexedPagination } from "@/hooks/useIndexedPagination"
import { useStore } from "@/stores/appStore"

const store = useStore()

const emit = defineEmits(["submitTarteel"])

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  height: {
    type: [Number, String],
    // Fill the full-screen overlay: viewport minus toolbar (57), container
    // padding (2 x 16) and the sticky header (44), with a little slack.
    default: "calc(100vh - 136px)",
  },
})
const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)
const { paginatedItems, handleInfiniteScroll, isLoading } =
  useIndexedPagination(
    computed(() => props.items[0]?.verses || []),
    targetedVerseIndex
  )

const handleVerseClick = (verse) => {
  store.setTarget(verse)
  emit("submitTarteel")
}
</script>

<style scoped>
.sura-board-overflow {
  height: v-bind('typeof height === "number" ? `${height}px` : height');
  overflow: auto;
}
</style>
