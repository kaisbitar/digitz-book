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
    <v-pagination v-model="page" :length="pageCount" :key="pageCount" :border="'sm'"></v-pagination>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTableOcc } from '@/mixins/tableOccMixin'
// export const {
//   windowHeight,
//   search,
//   matchingStatus,
//   getTableHeight,
//   changeSearch,
//   changeMatchingStatus,
//   highlight,
//   dataType,
//   footerProps,
//   tableHeaders,
//   isLoading,
// } = useTableOcc({})
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
