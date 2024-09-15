<template>
  <div class="webKitWidth grey lighten-5">
    <div class="d-flex pt-1 topBar">
      <appSearchBox
        @searchChanged="changeSearch"
        @matchChanged="changeMatchingStatus"
        :inputText="inputText"
        :dataType="dataType"
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
        :search="inputText"
        :items-per-page="50"
        v-model:page="page"
        @update:current-items="setCurrentItems"
        fixed-header
      >
        <template v-slot:item="{ item }">
          <tr
            :id="`verse${item.verseNumberToQuran}`"
            class="tableItem"
            :class="{
              mouseOverRow: showMenuIcon === `icon${item.verseNumberToQuran}`,
              activeTableItemClass: targetVerseNumberToQuran === item.verseNumberToQuran.toString(),
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
              :search="inputText"
              :cellItem="cellItem"
              @itemClicked="$emit('activateRowItem')"
            />
          </tr>
        </template>
      </v-data-table>
      <tablePagination
        :page="page"
        :pageCount="pageCount"
        :itemsLength="currentItemsLength"
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
import { useTableOcc } from '../mixins/tableOccMixin'
import { useGoTo } from 'vuetify'
import { nextTick } from 'vue'

const props = defineProps([
  'tableData',
  'groupBy',
  'includeTab',
  'inputText',
  'menuItems',
  'targetVerseNumberToQuran',
  'isLoading',
  'dataType',
  'footerProps',
  'tableHeaders',
])

const {
  matchingStatus,
  getTableHeight,
  collapseHeaders,
  changeSearch,
  changeMatchingStatus,
  highlight,
} = useTableOcc(props)

const emit = defineEmits(['rowClicked', 'activateRowItem', 'handleClickedMenu', 'activateItem'])
const store = useQuranStore()
const goTo = useGoTo()

// Reactive state
const showMenuIcon = ref(false)
const editItem = ref({})
const page = ref(1)
const itemsPerPage = 50 // Fixed at 50 items per page
const currentItems = ref([])

// Computed properties

const pageCount = computed(() => {
  return Math.ceil(props.tableData.length / itemsPerPage)
})
const activeView = computed(() => store.getActiveView)
const activeTab = computed(() => store.getActiveTab)

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
  // selectFirstItemInTable()
}

const scrollToActiveRow = async () => {
  await nextTick()
  const activeElements = document.getElementsByClassName('activeTableItemClass')
  if (activeElements.length > 0) {
    goTo('.activeTableItemClass', {
      container: '.versesTable .v-table__wrapper',
      offset: -100,
    })
  } else {
    console.log('No active elements found')
  }
}

const selectFirstItemInTable = () => {
  if (!currentItems.value[0]) return
  // if (storeFileName.value === '000المصحف') {
  //   activeTableItemIdLocal.value = currentItems.value[0].raw.verseNumberToQuran
  //   scrollToActiveRow()
  //   return
  // }
  emit('activateItem', currentItems.value[0].raw.verseNumberToQuran)
  scrollToActiveRow()
}

const passClickedMenuItem = item => {
  emit('handleClickedMenu', item.instuction)
}

const changePage = newPage => {
  page.value = newPage
}

watch(activeView, newValue => {
  if (newValue === 'textView') return
  scrollToActiveRow()
})

watch(activeTab, newValue => {
  if (newValue !== 'numberOfVerses') return
  scrollToActiveRow()
})

// Lifecycle hooks
onMounted(() => {
  scrollToActiveRow()
})

// Add this computed property
const currentItemsLength = computed(() => currentItems.value.length)
</script>

<style>
.versesTable {
  transition: width 0.4s;
}
.verse td {
  font-weight: 500;
}
.versesTable .v-table__wrapper {
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
