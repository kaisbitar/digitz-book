<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableData"
    :search="search"
    class="tableStyle"
    :class="scrollingContainerClass"
    :height="dynamicTableHeight"
    loading-text="جاري تحميل
    البيانات القرآنية ... الرجاء الانتظار"
    fixed-header
    items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item="{ item, index }">
      <TableRow
        class="tableItem v-border"
        :item="item"
        :index="index"
        :search="search"
        :activeItemKey="activeItemKey"
        :activeItemClass="props.activeItemClass"
        :headerKeys="tableHeaders.map((header) => header.key)"
        @activateRowItem="$emit('activateRowItem', item)"
      />
      <!-- <TableRowMobile
        class="tableItem v-border"
        :item="item"
        :index="index"
        :search="search"
        :activeItemKey="activeItemKey"
        :activeItemClass="props.activeItemClass"
        :headerKeys="tableHeaders.map((header) => header.key)"
        @activateRowItem="$emit('activateRowItem', item)"
      /> -->
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, onBeforeUnmount } from "vue"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"

interface TableItem {
  [key: string]: any
  fileName?: string
  verseNumberToQuran?: string | number
}

const props = defineProps<{
  tableData: TableItem[]
  tableHeaders: any[]
  height: number
  tableInputText?: string
  activeItemKey: string | number
  activeItemClass: string
  scrollingContainerClass: string
}>()

const { search } = useInputFiltering()
const { updateTableHeight, dynamicTableHeight, breakpoint } = useWindow()
const emit = defineEmits<{
  (e: "activateRowItem", item: TableItem): void
}>()

watch(
  () => props.tableInputText,
  (newValue) => {
    search.value = newValue
  }
)

onMounted(() => {
  search.value = props.tableInputText
  updateTableHeight(props.height)
  window.addEventListener("resize", updateTableHeight)
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
.v-table__wrapper {
  width: auto;
  /* overflow-x: hidden !important; */
}
.v-table--fixed-height > .v-table__wrapper {
  overflow-y: auto;
}
</style>
