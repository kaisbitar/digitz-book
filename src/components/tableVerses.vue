<template>
  <v-data-table-virtual
    v-model:page="page"
    :custom-filter="handleFiltering"
    :headers="tableVersesHeaders"
    :items="tableData"
    :search="search"
    :height="getTableHeight"
    :items-per-page="50"
    :loading="isLoading"
    class="tableStyle versesTable"
    ref="versesTable"
    loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
    fixed-header
  >
    <template v-slot:item="{ item, index }">
      <tr
        :id="`verse${item.verseNumberToQuran}`"
        class="tableItem"
        :class="{
          activeRowClass: isTargetedVerse(item, index, verseQuranKey),
        }"
        @click="$emit('activateRowItem', item)"
      >
        <TableVerseItem
          v-for="(cellItem, key) in item"
          :key="key"
          :search="search"
          :cellItem="cellItem"
        />
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineEmits } from "vue"
import { useQuranStore } from "@/stores/app"
import { useWindowMixin } from "../mixins/windowMixin"
import { useInputFiltering } from "../mixins/inputFiltering"
import { useGoTo } from "vuetify"
import { nextTick } from "vue"

const props = defineProps([
  "tableData",
  "tableInputText",
  "verseQuranKey",
  "isLoading",
  "fieldPlaceHolder",
  "tableVersesHeaders",
])

const { getTableHeight } = useWindowMixin(props)
const { search, handleFiltering } = useInputFiltering(props)

const emit = defineEmits(["rowClicked", "activateRowItem"])
const store = useQuranStore()
const goTo = useGoTo()

const page = ref(1)
const itemsPerPage = 50

const pageCount = computed(() => {
  return Math.ceil(props.tableData.length / itemsPerPage)
})

const isTargetedVerse = (item, index, verseNumberToQuran) => {
  if (verseNumberToQuran === undefined && index === 0) {
    return true
  }

  return verseNumberToQuran === String(item.verseNumberToQuran)
}

const scrollToActiveRow = async () => {
  await nextTick()
  // setTimeout(() => {
  const activeRowItem = store.getIsDialog
    ? document.querySelectorAll(".v-dialog .activeRowClass")
    : document.querySelectorAll(".activeRowClass")

  const container = store.getIsDialog
    ? ".v-dialog .versesTable .v-table__wrapper"
    : ".versesTable .v-table__wrapper"

  await nextTick()
  if (activeRowItem.length === 0) return
  console.log(store.getIsDialog)
  goTo(activeRowItem[0], {
    container: container,
    offset: -100,
    duration: 300,
  })
  // }, 100)
}

watch(
  () => props.tableInputText,
  (newValue) => {
    search.value = newValue
  }
)

onMounted(() => {
  search.value = props.tableInputText
  scrollToActiveRow()
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
</style>
