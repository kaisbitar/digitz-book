<template>
  <TableMobile
    :data="paginatedItems"
    :tableInputText="items[0]?.word"
    @scroll="handleInfiniteScroll"
    @rowClicked="handleVerseClick"
  />
</template>

<script setup>
import { defineProps, defineEmits } from "vue"
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
    default: 300,
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
@media (max-width: 768px) {
  .sura-board-overflow {
    height: v-bind('typeof height === "number" ? `${height}px` : height');
    overflow: auto;
  }
}
</style>
