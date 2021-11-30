<template>
  <div class=" grey lighten-5">
    <div class="d-flex pt-1 topBar">
      <appSearchBox
        @searchChanged="changeSearch"
        @matchChanged="changeMatchingStatus"
        :inputText="search"
        :dataType="dataType"
      />
    </div>
    <v-data-table
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="75"
      :search="search"
      :height="getTableHeight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle wordsTable"
      fixed-header
      :loader-height="2"
      click:row="$emit('rowClicked', item.index, item)"
      :page.sync="page"
      @page-count="pageCount = $event"
      @current-items="setCurrentItems"
      hide-default-footer
    >
    </v-data-table>
    <tablePagination
      :page="page"
      :pageCount="pageCount"
      :currentItemsLength="currentItemsLength"
      :label="'كلمة'"
    />
  </div>
</template>

<script>
import { tableOccMixin } from '../mixins/tableOccMixin'
import tablePagination from './tablePagination'
export default {
  name: '',
  components: { tablePagination },
  mixins: [tableOccMixin],
  data: () => ({
    page: 1,
    pageCount: 0,
    currentItemsLength: 0
  }),
  methods: {
    setCurrentItems (items) {
      if (!items) return
      this.currentItems = []
      this.currentItems = items
      this.currentItemsLength = items.length
    }
  }
}
</script>

<style>
.wordsTable{
  width: 450px
}
.groupHeader {
  /* height: 26px; */
  font-weight: bold;
  /* font-size: 12px; */
  cursor: pointer;
}
.v-chip {
  display: -webkit-inline-box;
}
</style>
