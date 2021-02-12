<template>
<div>
  <v-text-field
    mb-2
    v-model="search"
    append-icon="mdi-magnify"
    single-line
    hide-details
    class="mb-1 pa-3 searchField
    rounded mt-0"
    autofocus
    background-color="grey lighten-5 mb-0"
    :label="'ابحث ' + elementName"
  ></v-text-field>
    <v-data-table
      :search="search"
      :items="tableData"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      :height="300"
      :loading="isLoading"
      class="tableStyle"
      selectable-key
      :headers="headers"
      :group-by="groupBy"
      fixed-header
    >
      <template v-slot:item="{item}">
        <tr
          class="tableRow"
          :class="{'activeRow': item.verseIndx===selectedId}"
          @click="handleClick(item)"
        >
          <td class="pa-0 pr-3" v-bind:key="index" v-for="(header, index) in headers">
            <div v-html="$options.filters.highlightVerse(item[header.value],search)"></div>
          </td>
        </tr>
      </template>
    </v-data-table>
</div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'tableCust',
  props: ['headers', 'tableData', 'search', 'tableType', 'groupBy', 'elementName', 'isLoading'],
  mixins: [appMixin],
  data: () => ({
    drawer: false,
    selectedId: 1
  }),
  computed: { },
  methods: {
    handleClick (rowItem) {
      this.handleTableClick(rowItem, this.tableType)
      this.selectedId = rowItem.verseIndx
    }
  },
  created () {
  },
  mounted () {
  },
  filters: {
    highlightVerse: function (text, search) {
      if (search == null) {
        return text
      } else {
        text = text.toString()
        var qurey = new RegExp(search, 'gi')
        return text.replace(qurey, match => {
          return '<span class="orange">' + match + '</span>'
        })
      }
    }
  }
}
</script>

<style >
.searchField{
  max-width: 250px;
}
.v-data-footer{
  background: #f5f5f5 !important;
}
.tableRow{
  cursor: pointer;
}
.activeRow{
  /* yellow accent-1 */
  background: #FFFF8D ;
  /* color: white */
}
.activeRow:hover{
  background: yellow !important;

}
</style>
