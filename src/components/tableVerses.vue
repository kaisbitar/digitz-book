<template>
  <div class="webKitWidth">
    <searchBoxCollection
      @searChanged="searChanged"
      @matchanged="matchanged"
      @showChanged="showChanged"
      :inputText="search"
      :dataType="dataType"
    />
    <v-data-table
      :style="{ width: showDetail ? '550px' : '420px' }"
      :custom-filter="handleFiltering"
      :items="tableData"
      :headers="tableHeaders"
      :search="search"
      :items-per-page="25"
      :height="getHeight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle versesTable"
      fixed-header
      :group-by="groupBy"
      :loader-height="2"
      item-value="verseNumberToQuran"
      clearable
      clear-icon="mdi-close"
      ref="versesTable"
    >
      <template v-slot:item="props">
        <tr
          class="indexItem"
          @click="$emit('rowClicked', props.item)"
          :class="{
            active: props.item.verseNumberToQuran === parseInt(selectedId),
          }"
        >
          <td
            class="text-right"
            v-html="highlight(suraName(props.item.fileName), search)"
          ></td>
          <td
            v-html="highlight(props.item.verseIndex.toString(), search)"
            class="text-right"
          ></td>
          <td
            class="text-center"
            v-html="highlight(props.item.verseText, search)"
          ></td>
          <td
            class="text-right"
            v-if="showDetail"
            v-html="highlight(numberOfWords(props.item.verseText), search)"
          ></td>
          <td
            class="text-right"
            v-if="showDetail"
            v-html="highlight(numberOfLetters(props.item.verseText), search)"
          ></td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'
import searchBoxCollection from './searchBoxCollection.vue'

export default {
  components: { searchBoxCollection },
  name: '',
  mixins: [appMixin, tableOccMixin],
  props: ['selectedId', 'inputText'],
  data: () => ({
    showDetail: false,
    matchAll: false
  }),
  methods: {
    suraName (fileName) {
      return fileName.replace(/[0-9]/g, '')
    },
    numberOfWords (verseText) {
      var wordsCount = verseText.split(' ').length
      return wordsCount.toString()
    },
    numberOfLetters (verseText) {
      var lettersCount = verseText.replace(/ /g, '').length
      return lettersCount.toString()
    },
    handleFiltering (itemText, queryText) {
      itemText = ' ' + itemText + ' '
      if (!this.matchAll && itemText.match(queryText) !== null) {
        return itemText
      }
      // var regex = new RegExp('([^،-٩]+' + queryText + '[^،-٩]+)', 'gim')
      var regex = new RegExp(
        '([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)',
        'gim'
      )
      var match = itemText.match(regex)

      return match
    },
    searChanged (search) {
      this.search = search

      console.log(this.$refs.versesTable.internalCurrentItems)
    },
    matchanged (matchAll) {
      this.matchAll = matchAll[1]
      this.search = ''
      this.search = matchAll[0]
    },
    showChanged (showDetail) {
      this.showDetail = showDetail
    }
  },
  watch: {
    inputText () {
      this.search = this.inputText
    }
  },
  computed: {},
  created () {
    this.search = this.inputText
  }
}
</script>

<style >
.versesTable {
  transition: width 0.4s;
}
.versesTable .v-data-table__wrapper {
  overflow-x: hidden;
}
.groupHeader {
  height: 26px;
  font-weight: bold;
  font-size: 12px;
}
</style>
