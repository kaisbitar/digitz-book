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
    :label="'ابحث في ' + fileName"
  ></v-text-field>
    <v-data-table
      :search="search"
      :items="tableData"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      :height="300"
      :loading="isLoading"
      :items-per-page="5"
      class="cTable"
      selectable-key
      :headers="headers"
    >
      <template v-slot:item="{item}">
        <!--  -->
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

export default {
  props: ['headers', 'tableData', 'search'],
  data: () => ({
    drawer: false,
    isLoading: true,
    fileName: null,
    selectedId: 1
  }),
  computed: {
  },
  methods: {
    handleClick (item) {
      console.log(item)
      this.selectedId = item.verseIndx
      this.$store.commit('setFileName', item.sura)
      this.$store.commit('setTargetedVerse', item.verseIndx)
    }
  },
  created () {
    // this.fetchData()
  },
  mounted () {
    // this.$store.watch(
    //   state => state.fileName,
    //   () => {
    //     this.fetchData()
    //   })
    this.isLoading = false
  },
  filters: {
    highlightVerse: function (text, search) {
      if (search == null) {
        return text
      } else {
        text = text.toString()
        var qurey = new RegExp(search, 'gi')
        return text.replace(qurey, match => {
          return '<span style="background:orange !important">' + match + '</span>'
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
  background: #ffff83 ;
  /* color: white */
}
.activeRow:hover{
  background: yellow!important;

}
</style>
