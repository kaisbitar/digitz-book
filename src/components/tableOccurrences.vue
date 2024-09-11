<template>
  <div class="grey lighten-5">
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
      :footerProps="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle wordsTable"
      fixed-header
      :loader-height="2"
      @click:row="(event, item) => $emit('rowClicked', item.index, item)"
      :page.sync="page"
      @update:page-count="pageCount = $event"
      @update:current-items="setCurrentItems"
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

<script setup>
import { ref, computed } from 'vue'
import tablePagination from './tablePagination.vue'
import {
  getTableHeight,
  changeSearch,
  changeMatchingStatus,
  dataType,
} from '@/mixins/tableOccMixin'

const page = ref(1)
const pageCount = ref(0)
const currentItemsLength = ref(0)

const setCurrentItems = items => {
  if (!items) return
  currentItemsLength.value = items.length
}
</script>

<style>
.wordsTable {
  width: 450px;
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
