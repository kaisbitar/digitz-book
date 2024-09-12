<template>
  <div class="webKitWidth grey lighten-5">
    <div class="d-flex pt-1 topBar">
      <appSearchBox
        @search-changed="changeSearch"
        @match-changed="changeMatchingStatus"
        :input-text="search"
        :data-type="dataType"
      />
    </div>
    <div>
      <v-data-table
        loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
        class="tableStyle versesTable"
        ref="versesTable"
        :custom-filter="handleFiltering"
        :footer-props="footerProps"
        hide-default-footer
        :height="getTableHeight"
        :headers="tableHeaders"
        :loading="isLoading"
        :items="tableData"
        :search="search"
        :items-per-page="50"
        :page.sync="page"
        @page-count="pageCount = $event"
        @current-items="setCurrentItems"
        fixed-header
      >
        <template #item="{ item }">
          <tr
            :id="`verse${item.verseNumberToQuran}`"
            class="tableItem"
            :class="{
              mouseOverRow: showMenuIcon === `icon${item.verseNumberToQuran}`,
              activeTableItem2: activeTableItemIdLocal === item.verseNumberToQuran.toString(),
            }"
            @click="$emit('rowClicked', item)"
            @mouseover="showMenuIcon = `icon${item.verseNumberToQuran}`"
            @mouseleave="showMenuIcon = 'icon'"
          >
            <appDropMenu
              class="menuIcon"
              :items="menuItems"
              :class="{
                activeIcon: showMenuIcon === `icon${item.verseNumberToQuran}`,
              }"
            />
            <td
              :class="{
                hideIt: showMenuIcon === `icon${item.verseNumberToQuran}`,
              }"
            />
            <tableVerseItem
              v-for="(cellItem, index) in item"
              :key="index"
              :search="search"
              :cellItem="cellItem"
              @itemClicked="$emit('activateRowItem')"
            />
          </tr>
        </template>
      </v-data-table>
      <tablePagination
        :page="page"
        :page-count="pageCount"
        :current-items-length="currentItemsLength"
        label="آية"
        @pageChanged="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineEmits } from 'vue'
import { useQuranStore } from '@/stores/app'
import appSearchBox from './appSearchBox.vue'
import tableVerseItem from './tableVerseItem.vue'
import appDropMenu from './appDropMenu.vue'
import tablePagination from './tablePagination.vue'
import {
  getTableHeight,
  changeSearch,
  changeMatchingStatus,
  dataType,
  footerProps,
  isLoading,
  tableHeaders,
} from '@/mixins/tableOccMixin'
const emit = defineEmits(['rowClicked', 'activateRowItem', 'handleClickedMenu'])

const props = defineProps(['tableData', 'inputText', 'menuItems', 'activeTableItemId'])

const store = useQuranStore()

// Reactive state
const matchingStatus = ref(false)
const showMenuIcon = ref(false)
const activeTableItemIdLocal = ref('')
const editItem = ref({})
const page = ref(1)
const pageCount = ref(0)
const currentItemsLength = ref(0)
const search = ref('')
const currentItems = ref([])

// Computed properties
const activeView = computed(() => store.getActiveView)
const activeTab = computed(() => store.getActiveTab)
const selectedSearch = computed(() => store.getSelectedSearch)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const storeFileName = computed(() => store.getTarget.fileName)

// Methods
const handleFiltering = (itemText, queryText) => {
  itemText = ' ' + itemText + ' '
  if (!matchingStatus.value && itemText.match(queryText) !== null) {
    return itemText
  }
  return itemText.match(new RegExp('([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)', 'gim'))
}

const setCurrentItems = items => {
  if (!items) return
  currentItems.value = items
  currentItemsLength.value = items.length
  selectFirstItemInTable()
}

const scrollToActiveRow = () => {
  if (document.getElementsByClassName('activeTableItem2').length > 0) {
    setTimeout(() => {
      vuetify.goTo('.activeTableItem2', {
        container: '.versesTable .v-data-table__wrapper',
        offset: 100,
      })
    }, 100)
  }
}

const selectFirstItemInTable = () => {
  if (!currentItems.value[0]) return
  if (storeFileName.value === '000المصحف') {
    activeTableItemIdLocal.value = currentItems.value[0].verseNumberToQuran
    scrollToActiveRow()
    return
  }
  activeTableItemIdLocal.value = currentItems.value[0].verseNumberToQuran
  scrollToActiveRow()
}

const passClickedMenuItem = item => {
  emit('handleClickedMenu', item.instuction)
}

const changePage = newPage => {
  page.value = newPage
}

// Watchers
watch(
  () => props.inputText,
  newValue => {
    search.value = newValue
  },
)

watch(activeView, newValue => {
  if (newValue === 'textView') return
  scrollToActiveRow()
})

watch(activeTab, newValue => {
  if (newValue !== 'numberOfVerses') return
  scrollToActiveRow()
})

watch(
  () => props.tableData,
  () => {
    page.value = 1
    scrollToActiveRow()
  },
)

watch(
  () => props.activeTableItemId,
  newValue => {
    activeTableItemIdLocal.value = newValue
  },
)

// Lifecycle hooks
onMounted(() => {
  search.value = props.inputText
  activeTableItemIdLocal.value = props.activeTableItemId
  scrollToActiveRow()
})
</script>

<style>
.versesTable {
  transition: width 0.4s;
}
.verse td {
  font-weight: 500;
}
.versesTable .v-data-table__wrapper {
  overflow-x: hidden;
}
.menuIcon {
  display: none;
  padding-left: 57px !important;
  cursor: default !important;
}
.activeIcon {
  vertical-align: middle;
  display: table-cell;
  border: none;
  padding-left: 15px;
}
.mouseOverRow td:nth-child(2) {
  opacity: 0;
  display: none;
}
.topBar {
  height: 49px;
}
</style>
