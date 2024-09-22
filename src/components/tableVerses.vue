<template>
  <div>
    <AppSearchBox
      :inputText="search"
      :fieldPlaceHolder="fieldPlaceHolder"
      :prepend-icons="[
        { name: 'mdi-filter', event: 'filter' },
        { name: 'mdi-magnify', event: 'search' },
      ]"
      @update:inputText="changeSearch"
      @iconEvent="handleIconEvent"
    />
    <v-data-table
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
    </v-data-table>
    <!-- <v-pagination v-model="page" :length="pageCount" :key="pageCount" :border="'sm'"></v-pagination> -->
  </div>
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
  "inputText",
  "verseQuranKey",
  "isLoading",
  "fieldPlaceHolder",
  "tableVersesHeaders",
])

const { getTableHeight } = useWindowMixin(props)
const { changeSearch, changeMatchingStatus, search, handleFiltering } =
  useInputFiltering(props)

const emit = defineEmits(["rowClicked", "activateRowItem"])
const store = useQuranStore()
const goTo = useGoTo()

const page = ref(1)
const itemsPerPage = 50

const pageCount = computed(() => {
  return Math.ceil(props.tableData.length / itemsPerPage)
})
const activeView = computed(() => store.getActiveView)
const activeTab = computed(() => store.getActiveSuraTab)

const isTargetedVerse = (item, index, verseNumberToQuran) => {
  if (verseNumberToQuran === undefined && index === 0) {
    return true
  }

  return verseNumberToQuran === item.verseNumberToQuran.toString()
}

const scrollToActiveRow = async () => {
  await nextTick()
  const activeElements = document.getElementsByClassName("activeRowClass")
  if (!activeElements.length > 0) return
  goTo(".activeRowClass", {
    container: ".versesTable .v-table__wrapper",
    offset: -100,
  })
}

watch(activeView, (newValue) => {
  if (newValue === "textView") return
  scrollToActiveRow()
})

watch(activeTab, (newValue) => {
  if (newValue !== "numberOfVerses") return
  scrollToActiveRow()
})

watch(
  () => props.inputText,
  (newValue) => {
    search.value = newValue
  }
)

const handleIconEvent = (eventName) => {
  switch (eventName) {
    case "filter":
      break
    case "search":
      changeMatchingStatus()
      break
    default:
      console.warn(`Unhandled icon event: ${eventName}`)
  }
}

onMounted(() => {
  search.value = props.inputText
  scrollToActiveRow()
})
</script>

<style>
.tableItem td {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
</style>
