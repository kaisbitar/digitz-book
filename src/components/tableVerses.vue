<template>
  <div class="webKitWidth grey lighten-5">
    <div class="d-flex pt-1 topBar">
      <appSearchBox
        @searchChanged="changeSearch"
        @matchChanged="changeMatchingStatus"
        :inputText="search"
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
        :height="getTableHeight()"
        :headers="tableHeaders"
        :loading="isLoading"
        :group-by="groupBy"
        :items="tableData"
        :search="search"
        :items-per-page="50"
        :page.sync="page"
        @page-count="pageCount = $event"
        @current-items="setCurrentItems"
        fixed-header
      >
        <template v-slot:item="props">
          <tr
            :id="'verse' + props.item.verseNumberToQuran"
            class="tableItem"
            :class="{
              mouseOverRow: showMenuIcon === 'icon' + props.item.verseNumberToQuran.toString(),
              activeTableItem2: activeTableItemIdLocal ===  props.item.verseNumberToQuran.toString() }"
            @click="$emit('rowClicked', props.item)"
            @mouseover="showMenuIcon = 'icon' + props.item.verseNumberToQuran.toString()"
            @mouseleave="showMenuIcon = 'icon' "
          >
            <appDropMenu
              class="menuIcon"
              :items="menuItems"
              @itemClicked="passClickedMenuItem"
              :class="{activeIcon: showMenuIcon === 'icon' + props.item.verseNumberToQuran.toString()}"
            />
            <td
              :class="{hideIt: showMenuIcon === 'icon' + props.item.verseNumberToQuran.toString()}"
              v-html="( page - 1 ) * 50 + props.index + 1"
            />
            <tableVerseItem
              v-for="(cellItem, index) in props.item"
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
        :pageCount="pageCount"
        :currentItemsLength="currentItemsLength"
        :label="'آية'"
        @pageChanged="changePage"
      />
    </div>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'
import appSearchBox from './appSearchBox'
import tableVerseItem from './tableVerseItem.vue'
import appDropMenu from './appDropMenu'
import tablePagination from './tablePagination'

export default {
  components: { appSearchBox, tableVerseItem, appDropMenu, tablePagination },
  name: '',
  mixins: [appMixin, tableOccMixin],
  props: ['tableData', 'inputText', 'menuItems', 'activeTableItemId'],
  data: () => ({
    matchingStatus: false,
    showMenuIcon: false,
    activeTableItemIdLocal: '',
    editItem: {},
    page: 1,
    pageCount: 0,
    currentItemsLength: 0
  }),
  methods: {
    handleFiltering (itemText, queryText) {
      itemText = ' ' + itemText + ' '
      if (!this.matchingStatus && itemText.match(queryText) !== null) {
        return itemText
      }
      return itemText.match(
        new RegExp(
          '([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)',
          'gim'
        )
      )
    },
    setCurrentItems (items) {
      if (!items) return
      this.currentItems = []
      this.currentItems = items
      this.currentItemsLength = items.length
      this.selectFirstItemInTable()
    },
    scrollToActiveRow () {
      if (document.getElementsByClassName('activeTableItem2').length > 0) {
        setTimeout(() => {
          this.$vuetify.goTo('.activeTableItem2', {
            container: '.versesTable .v-data-table__wrapper',
            offset: 100
          })
        }, 100)
      }
    },
    selectFirstItemInTable () {
      if (!this.currentItems[0]) return
      if (this.storeFileName === '000المصحف') {
        this.activeTableItemIdLocal = this.currentItems[0].verseNumberToQuran
        this.scrollToActiveRow()
        return
      }
      this.activeTableItemIdLocal = this.currentItems[0].verseNumberToQuran
      this.$store.commit('setTarget', { fileName: this.currentItems[0].fileName, verseIndex: this.currentItems[0].verseIndex })
      this.scrollToActiveRow()
    },
    passClickedMenuItem (item) {
      this.$emit('handleClickedMenu', item.instuction)
    },
    changePage (page) {
      this.page = page
    }
  },
  computed: {
    activeView () {
      return this.$store.getters.activeView
    },
    activeTab () {
      return this.$store.getters.activeTab
    },
    selectedSearch () {
      return this.$store.getters.selectedSearch
    },
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    },
    storeFileName () {
      return this.$store.getters.target.fileName
    }
  },
  watch: {
    inputText () {
      this.search = this.inputText
    },
    activeView () {
      if (this.activeView === 'textView') return
      this.scrollToActiveRow()
    },
    activeTab () {
      if (this.activeTab !== 'numberOfVerses') return
      this.scrollToActiveRow()
    },
    tableData () {
      this.page = 1
      this.scrollToActiveRow()
    },
    activeTableItemId () {
      this.activeTableItemIdLocal = this.activeTableItemId
    }
  },
  mounted () {
    this.search = this.inputText
    this.activeTableItemIdLocal = this.activeTableItemId
    this.scrollToActiveRow()
  }
}
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
