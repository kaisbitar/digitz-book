<template>
  <v-data-table
    ref="tableRef"
    :headers="tableHeaders"
    :items="tableData"
    loading-text="تنزيل الكتاب.."
    :fixed-header="true"
    :height="tableHeight"
    items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item="{ item, index }">
      <TableRow
        :item="item"
        :index="index"
        :isIndexItem="isIndexItem"
        :search="search"
        :activeItemKey="activeItemKey"
        :activeItemClass="activeItemClass"
        :headerKeys="tableHeaders.map((header) => header.key)"
        @rowClicked="$emit('rowClicked', item)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"

interface TableItem {
  [key: string]: any
  verseNumberToQuran?: string | number
  isIndexItem?: boolean
}
const props = defineProps<{
  tableData: TableItem[]
  tableHeaders: any[]
  tableInputText?: string
  activeItemKey: string | number
  activeItemClass: string
  isIndexItem?: boolean
  tableHeight?: string
}>()

const tableRef = ref(null)

const { search } = useInputFiltering()

const emit = defineEmits<{
  (e: "rowClicked", item: TableItem): void
  (e: "scroll", event: Event): void
}>()

const handleScroll = (event: Event) => {
  emit("scroll", event)
}

watch(
  () => props.tableInputText,
  (newValue) => {
    search.value = newValue
  }
)

onMounted(async () => {
  search.value = props.tableInputText

  const scrollContainer = tableRef.value.$el.querySelector(".v-table__wrapper")
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", handleScroll)
  }
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
</style>
