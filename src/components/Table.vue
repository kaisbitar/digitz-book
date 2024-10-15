<template>
  <div ref="tableRef">
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      :search="search"
      :class="scrollingContainerClass"
      :height="dynamicHeight"
      loading-text="جاري تحميل
    البيانات القرآنية ... الرجاء الانتظار"
      fixed-header
      items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <TableRow
          class="tableItem"
          :item="item"
          :index="index"
          :search="search"
          :activeItemKey="activeItemKey"
          :scrollingItemClass="props.scrollingItemClass"
          :headerKeys="tableHeaders.map((header) => header.key)"
          @activateRowItem="$emit('activateRowItem', item)"
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
}

const props = defineProps<{
  tableData: TableItem[]
  tableHeaders: any[]
  tableInputText?: string
  activeItemKey: string | number
  scrollingItemClass: string
  scrollingContainerClass: string
}>()

const tableRef = ref(null)

const { search } = useInputFiltering()
const { setContainerHeight, dynamicHeight } = useWindow(tableRef)

const emit = defineEmits<{
  (e: "activateRowItem", item: TableItem): void
}>()

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
