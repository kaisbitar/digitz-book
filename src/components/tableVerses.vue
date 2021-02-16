<template>
  <div>
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-1 mr-1 pa-3 searchField rounded mt-1"
      background-color="grey lighten-5 mb-0"
      single-line
      hide-details
      autofocus
    ></v-text-field>
    <v-data-table
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="2000"
      :search="search"
      :height="getheight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle"
      fixed-header
      :group-by="groupBy"
      :loader-height="2"
    >
      <template v-slot:item="props">
        <tr
        class="indexItem"
          :class="{ activeRow: props.item.verseIndx === parseInt(selectedId) }"
        >
          <td
          class="text-center"
        >
        {{props.item.verseIndx}}
        </td>
        <td
          @click="$emit('rowClicked', props.item)"
          class=" pa-2 "
          v-html="highlight(props.item.verseText, search)"
        >
        </td></tr>
      </template>

    </v-data-table>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'

export default {
  name: '',
  mixins: [appMixin, tableOccMixin]
}
</script>

<style >

.groupHeader {
  height: 26px;
  font-weight: bold;
  font-size: 12px;
}
.activeRow {
  color: #737373 !important;
  /* brown */
  background: #efebe9 !important;
  font-weight: 500;
}
</style>
