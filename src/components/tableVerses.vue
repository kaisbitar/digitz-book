<template>
  <v-card class="webKitWidth grey lighten-4" outlined>
    <div class="d-flex">
      <glSearchBox
        @searchChanged="searchChanged"
        @matchChanged="matchChanged"
        :inputText="search"
        :dataType="dataType"
      />
      <div>
        <v-icon
          :color="showDetail === false ? 'grey' : 'blue'"
          @click="showDetail = !showDetail"
          class="mt-6 mb-1 mr-3"
        >
          mdi-dots-horizontal
        </v-icon>
      </div>
      <div class="mt-5 mr-3"><v-icon v-if="search" @click="setSuraFilter()" small >mdi-table-plus</v-icon></div>
    </div>
    <v-data-table
      :style="{ width: showDetail ? '690px' : '450px' }"
      :custom-filter="handleFiltering"
      :items="tableData"
      :headers="tableHeaders"
      :search="search"
      :items-per-page="25"
      :height="getVersesTable()"
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
          :id="'v' + (props.item.verseNumberToQuran).toString()"
          :class="{
            active2: props.item.verseNumberToQuran === parseInt(selectedId),
          }"
        >
          <td
            class="text-right"
            v-html="highlight(getSuraName(props.item.fileName), search)"
          ></td>
          <td
            v-html="highlight(props.item.verseIndex.toString(), search)"
            class="text-right"
          ></td>
          <td
            class="text-center pt-2 pb-2"
            v-html="highlight(props.item.verseText, search)"
          ></td>
          <td
            class="text-right"
            v-html="highlight(getNumberOfWords(props.item.verseText), search)"
          ></td>
          <td
            class="text-right"
            v-html="highlight(getNumberOfLetters(props.item.verseText), search)"
          ></td>
          <td
            class="text-right"
            v-html="highlight( props.item.verseNumberToQuran.toString(), search)"
          ></td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'
import glSearchBox from './glSearchBox'

export default {
  components: { glSearchBox },
  name: '',
  mixins: [appMixin, tableOccMixin],
  props: ['selectedId', 'inputText'],
  data: () => ({
    showDetail: false,
    matchAll: false
  }),
  methods: {
    getSuraName (fileName) {
      var suraNumber = fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
      return parseInt(suraNumber, 10) + ' ' + fileName.replace(/[0-9]/g, '')
    },
    getNumberOfWords (verseText) {
      var wordsCount = verseText.split(' ').length
      return wordsCount.toString()
    },
    getNumberOfLetters (verseText) {
      var lettersCount = verseText.replace(/ /g, '').length
      return lettersCount.toString()
    },
    handleFiltering (itemText, queryText) {
      itemText = ' ' + itemText + ' '
      if (!this.matchAll && itemText.match(queryText) !== null) {
        return itemText
      }
      var regex = new RegExp(
        '([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)',
        'gim'
      )
      var match = itemText.match(regex)

      return match
    },
    scrollTo () {
      if (document.getElementsByClassName('active2').length > 0) {
        this.$vuetify.goTo('.active2', {
          container: '.versesTable .v-data-table__wrapper'
        })
      }
    },
    searchChanged (search) {
      this.search = search
    },
    matchChanged (matchAll) {
      this.matchAll = matchAll[1]
      this.search = ''
      this.search = matchAll[0]
    },
    setSuraFilter () {
      var filteredSearchItem = this.$refs.versesTable.$children[0].filteredItems
      var selectedSearchIndex = this.$store.getters.filteredSearch.length - 1
      var value = {
        resultsCount: filteredSearchItem.length,
        inputText: this.search,
        parentSearch: this.parentSearch,
        result: filteredSearchItem
      }
      this.$store.commit('setFilterSelectedIndex', selectedSearchIndex + 1)
      this.$store.commit('setFilterSelectedSearch', value)
      this.$store.commit('setFilteredSearchItem', value)
      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
    },
    getVersesTable () {
      var tabHeight = 0
      if (this.includeTab) { tabHeight = -20 }
      var heightDif = this.windowHeight - 250 + tabHeight
      return heightDif
    }
  },
  watch: {
    inputText () {
      this.search = this.inputText
    },
    activeView () {
      if (this.activeView === 'suraText') return
      this.scrollTo()
    },
    activeTab () {
      if (this.activeTab !== 'numberOfVerses') return
      this.scrollTo()
    },
    fileName () {
      if (document.getElementsByClassName('active2')) return
      this.scrollTo()
    }
  },
  computed: {
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    },
    parentSearch () {
      if (this.fileName) { return this.fileName }
      return this.search
    },
    activeView () {
      return this.$store.getters.activeView
    },
    activeTab () {
      return this.$store.getters.activeTab
    }
  },
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
