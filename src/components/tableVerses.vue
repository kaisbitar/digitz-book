<template>
  <div class="webKitWidth">
    <div class="d-flex searchWrap">
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
      <div>
        <v-icon
          :color="showDetail === false ? 'grey' : 'blue'"
          @click="showDetail = !showDetail"
          class="mt-9 ml-4"
        >
          mdi-dots-horizontal
        </v-icon>
      </div>
    </div>
    <v-data-table
      :style="{ width: showDetail ? '550px' : '375px' }"
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="25"
      :search="search"
      :height="getHeight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle versesTable"
      fixed-header
      :group-by="groupBy"
      :loader-height="2"
    >
      <template v-slot:item="props">
        <tr
          class="indexItem"
          @click="$emit('rowClicked', props.item)"
          :class="{ activeRow: props.item.verseIndex === parseInt(selectedId) }"
        >
          <td class="text-right">
            {{ props.item.verseIndex }}
          </td>
          <td
            class="text-right"
            v-html="highlight(props.item.verseText, search)"
          ></td>

          <td
            class="text-right"
            v-if="fileName"
            v-html="highlight(fileName, search)"
          ></td>
          <td
            class="text-right"
            v-else
            v-html="highlight(props.item.fileName, search)"
          ></td>

          <td
            class="text-right"
            v-if="showDetail"
            v-html="highlight(numberOfWords(props.item.verseText))"
          ></td>
          <td
            class="text-right"
            v-if="showDetail"
            v-html="highlight(numberOfLetters(props.item.verseText))"
          ></td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'

export default {
  name: '',
  mixins: [appMixin, tableOccMixin],
  data: () => ({
    showDetail: false
  }),
  methods: {
    numberOfWords (verseText) {
      var wordsCount = verseText.split(' ').length
      return wordsCount.toString()
    },
    numberOfLetters (verseText) {
      var lettersCount = verseText.replace(/ /g, '').length
      return lettersCount.toString()
    }
  },
  computed: {
    fileName () {
      if (!this.$store.getters.target.fileName) {
        return null
      }
      return this.$store.getters.target.fileName
    }
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
.activeRow {
  color: #737373 !important;
  /* brown */
  background: #efebe9 !important;
  font-weight: 500;
}
</style>
