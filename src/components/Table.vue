<template>
  <v-data-table-virtual
    :custom-filter="handleFiltering"
    :headers="tableHeaders"
    :items="tableData"
    :search="search"
    :height="dynamicTableHeight"
    class="tableStyle"
    :class="scrollingContainerClass"
    loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
    fixed-header
  >
    <template v-slot:item="{ item, index }"
      >{{ search }}
      <TableRow
        class="tableItem"
        :item="item"
        :search="search"
        :activeItemKey="activeItemKey"
        :activeItemClass="props.activeItemClass"
        @activateRowItem="$emit('activateRowItem', item)"
      />
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, onBeforeUnmount } from "vue"
import { useWindowMixin } from "../mixins/windowMixin"
import { useInputFiltering } from "../mixins/inputFiltering"

const { highlight } = useInputFiltering()

interface TableItem {
  [key: string]: any
  fileName?: string
  verseNumberToQuran?: string | number
}

const props = defineProps<{
  tableData: TableItem[]
  tableHeaders: any[]
  tableInputText?: string
  activeItemKey: string | number
  activeItemClass: string
  scrollingContainerClass: string
}>()

const { getTableHeight } = useWindowMixin()
const dynamicTableHeight = ref(0) // New reactive variable for dynamic height

const { search, handleFiltering } = useInputFiltering()

const emit = defineEmits<{
  (e: "activateRowItem", item: TableItem): void
}>()

const updateTableHeight = () => {
  dynamicTableHeight.value = window.innerHeight - 200
}

onMounted(() => {
  search.value = props.tableInputText
  updateTableHeight()
  window.addEventListener("resize", updateTableHeight)
})

watch(
  () => props.tableInputText,
  (newValue) => {
    search.value = newValue
  }
)

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight)
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
</style>
