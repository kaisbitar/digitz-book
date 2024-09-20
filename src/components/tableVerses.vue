<template>
  <AppSearchBox
    :inputText="search"
    :dataType="dataType"
    :prepend-icons="[
      { name: 'mdi-filter', event: 'filter' },
      { name: 'mdi-sort', event: 'sort' },
      { name: 'mdi-magnify', event: 'search' },
    ]"
    @update:inputText="changeSearch"
    @iconEvent="handleIconEvent"
  />
  <v-data-table
    loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
    class="tableStyle versesTable"
    ref="versesTable"
    :custom-filter="handleFiltering"
    :footer-props="footerProps"
    hide-default-footer
    :height="getTableHeight"
    :headers="tableVersesHeaders"
    :loading="isLoading"
    :items="tableData"
    :search="search"
    :items-per-page="50"
    v-model:page="page"
    @update:current-items="setCurrentItems"
    fixed-header
  >
    <template v-slot:item="{ item, index }">
      <tr
        :id="`verse${item.verseNumberToQuran}`"
        class="tableItem"
        :class="{
          activeTableItemClass: isTargetedVerse(item, index, props.targetVerseNumberToQuran),
        }"
        @click="$emit('rowClicked', item)"
      >
        <TableVerseItem
          v-for="(cellItem, key) in item"
          :key="key"
          :search="search"
          :cellItem="cellItem"
          @itemClicked="$emit('activateRowItem', item)"
        />
      </tr>
    </template>
  </v-data-table>
  <v-pagination v-model="page" :length="pageCount" :key="pageCount" :border="'sm'"></v-pagination>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineEmits } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useWindowMixin } from '../mixins/windowMixin'
import { useInputFiltering } from '../mixins/inputFiltering'
import { useGoTo } from 'vuetify'
import { nextTick } from 'vue'

const props = defineProps([
  'tableData',
  'groupBy',
  'includeTab',
  'inputText',
  'targetVerseNumberToQuran',
  'isLoading',
  'dataType',
  'footerProps',
  'tableVersesHeaders',
])

const { getTableHeight } = useWindowMixin(props)
const { changeSearch, changeMatchingStatus, search, handleFiltering } = useInputFiltering(props)

const emit = defineEmits(['rowClicked', 'activateRowItem', 'activateItem'])
const store = useQuranStore()
const goTo = useGoTo()

// Reactive state
const page = ref(1)
const itemsPerPage = 50 // Fixed at 50 items per page
const currentItems = ref([])

// Computed properties

const pageCount = computed(() => {
  return Math.ceil(props.tableData.length / itemsPerPage)
})
const activeView = computed(() => store.getActiveView)
const activeTab = computed(() => store.getActiveTab)
const currentItemsLength = computed(() => currentItems.value.length)

const setCurrentItems = items => {
  if (!items) return
  currentItems.value = items
  selectFirstItemInTable()
}

const selectFirstItemInTable = () => {
  if (!currentItems.value[0]) return
  scrollToActiveRow()
}

const isTargetedVerse = (item, index, verseNumberToQuran) => {
  if (verseNumberToQuran === undefined && index === 0) {
    return true
  }

  return verseNumberToQuran === item.verseNumberToQuran.toString()
}

const scrollToActiveRow = async () => {
  await nextTick()
  const activeElements = document.getElementsByClassName('activeTableItemClass')
  if (!activeElements.length > 0) return
  goTo('.activeTableItemClass', {
    container: '.versesTable .v-table__wrapper',
    offset: -100,
  })
}

watch(activeView, newValue => {
  if (newValue === 'textView') return
  scrollToActiveRow()
})

watch(activeTab, newValue => {
  if (newValue !== 'numberOfVerses') return
  scrollToActiveRow()
})

watch(
  () => props.inputText,
  newValue => {
    search.value = newValue
  },
)

// Lifecycle hooks
onMounted(() => {
  search.value = props.inputText
  scrollToActiveRow()
})

const handleIconEvent = eventName => {
  switch (eventName) {
    case 'filter':
      break
    case 'sort':
      break
    case 'search':
      changeMatchingStatus()
      break
    default:
      console.warn(`Unhandled icon event: ${eventName}`)
  }
}
</script>

<style></style>
