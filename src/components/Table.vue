<template>
  <div ref="tableRef">
    <v-data-table
      :disable-filter="true"
      :headers="tableHeaders"
      :items="tableData"
      :search="search"
      :height="dynamicHeight"
      loading-text="تنزيل الكتاب.."
      fixed-header
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useResizeHandler } from "@/hooks/useResizeObserver"

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
}>()

const tableRef = ref(null)

const { search } = useInputFiltering()
const { setContainerHeight, dynamicHeight } = useWindow(tableRef)

const emit = defineEmits<{
  (e: "rowClicked", item: TableItem): void
}>()

// const numberOfWords = computed(() =>
//   props.item.verseText.split(" ").length.toString()
// )
// const numberOfLetters = computed(() =>
//   props.item.verseText.replace(/ /g, "").length.toString()
// )

useResizeHandler({ elementRef: tableRef, elementFunc: setContainerHeight })

watch(
  () => props.tableInputText,
  (newValue) => {
    search.value = newValue
  }
)

onMounted(async () => {
  search.value = props.tableInputText
  await nextTick()
  setContainerHeight()
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
</style>
