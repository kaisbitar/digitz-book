<template>
  <v-list class="auto-verse-list opacity-70">
    <TableMobile
      :data="paginatedItems"
      :tableInputText="items[0]?.word"
      @scroll="handleInfiniteScroll"
    />
    <div class="list-append">
      <AppTarteelBtn
        :checked-items="items[0]?.verses"
        :btn-text="`آية`"
        :badge-type="'verse-count'"
        :is-disabled="items.length === 0"
        @submit="emit('submitTarteel')"
        @scroll="handleInfiniteScroll"
      />
    </div>
  </v-list>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"
import { usePagination } from "@/hooks/usePagination"
import { useStore } from "@/stores/appStore"

const store = useStore()

const emit = defineEmits([
  "update:checkedItems",
  "update:currentWordsList",
  "submitTarteel",
])

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  checkedItems: {
    type: Array,
    default: () => [],
  },
  height: {
    type: [Number, String],
    default: 490,
  },
})
const targetedVerseIndex = computed(() => store.getTarget?.verseNumberToQuran)
const { paginatedItems, handleInfiniteScroll, isLoading } = usePagination(
  computed(() => props.items[0]?.verses || []),
  targetedVerseIndex
)
</script>

<style scoped>
.auto-verse-list {
  z-index: 1;
  padding-top: 0 !important;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.list-append {
  padding: 0px 16px;
}
</style>
