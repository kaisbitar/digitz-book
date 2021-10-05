<template>
  <div class="webKitWidth grey lighten-4" outlined>
    <div class="d-flex">
      <glSearchBox
        @searchChanged="searchChanged"
        @matchChanged="matchChanged"
        :inputText="search"
        :dataType="dataType"
      />
      <div>
        <!-- setSuraFilter() -->
        <v-btn @click="dialog = false">
          <v-icon v-if="search" class="mt-6 mb-1 mr-3" small>
            mdi-table-plus</v-icon
          >
        </v-btn>
      </div>
    </div>
    <div id="indexBlock">
      <tableVersesEdit
        v-if="dialog"
        @close="dialog = false"
        :editItem="editItem"
        :dialog="dialog"
      />
      <v-data-table
        :custom-filter="handleFiltering"
        :items="tableData"
        :headers="tableHeaders"
        :search="search"
        :items-per-page="286"
        :height="getVersesTable()"
        :footer-props="footerProps"
        :loading="isLoading"
        loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
        class="tableStyle versesTable"
        fixed-header
        :group-by="groupBy"
        ref="versesTable"
      >
        <template v-slot:item="props">
          <tr
            class="indexItem verse"
            @click="$emit('rowClicked', props.item), (editItem = props.item)"
            :id="'v' + props.item.verseNumberToQuran.toString()"
            :class="{
              active2: props.item.verseNumberToQuran === parseInt(selectedId),
            }"
            @mouseover="
              showDetailsIcon =
                'icon' + props.item.verseNumberToQuran.toString()
            "
          >
            <td class="text-right">
              <div
                class="indexNumber"
                :class="{
                  activeIcon:
                    showDetailsIcon ===
                    'icon' + props.item.verseNumberToQuran.toString(),
                }"
              >
                {{ props.index + 1 }}
              </div>
              <glDropMenu
                @itemClicked="itemClicked"
                class="detailIcon"
                :class="{
                  activeIcon:
                    showDetailsIcon ===
                    'icon' + props.item.verseNumberToQuran.toString(),
                }"
                :items="menuItems"
              />
            </td>
            <td
              class="text-right"
              @click="goToverse()"
              v-html="highlight(getSuraName(props.item.fileName), search)"
            ></td>
            <td
              @click="goToverse()"
              v-html="highlight(props.item.verseIndex.toString(), search)"
              class="text-right"
            ></td>
            <td
              @click="goToverse()"
              class="text-right pt-2 pb-2"
              v-html="highlight(props.item.verseText, search)"
            ></td>
            <td
              class="text-right"
              @click="goToverse()"
              v-html="highlight(getNumberOfWords(props.item.verseText), search)"
            ></td>
            <td
              class="text-right"
              @click="goToverse()"
              v-html="
                highlight(getNumberOfLetters(props.item.verseText), search)
              "
            ></td>
            <td
              class="text-right"
              @click="goToverse()"
              v-html="
                highlight(props.item.verseNumberToQuran.toString(), search)
              "
            ></td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { tableOccMixin } from '../mixins/tableOccMixin'
import glSearchBox from './glSearchBox'
import glDropMenu from './glDropMenu'
import tableVersesEdit from './tableVersesEdit.vue'

export default {
  components: { glSearchBox, glDropMenu, tableVersesEdit },
  name: '',
  mixins: [tableOccMixin],
  props: ['selectedId', 'inputText'],
  data: () => ({
    matchAll: false,
    showDetailsIcon: false,
    menuItems: [
      { title: 'تفصيل الآية', instuction: 'verseDetail' },
      { title: 'تحرير الآية', instuction: 'editVerse' },
      { title: 'إلغاء', instuction: 'cancel' }
    ],
    dialog: false,
    editItem: {}
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
    goToverse () {
      this.$store.commit('setActiveView', 'suraText')
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    itemClicked (item) {
      if (item.instuction === 'verseDetail') {
        this.$emit('itemClicked', item.instuction)
        return
      }
      if (item.instuction === 'editVerse') {
        this.dialog = true
      }
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
      var filteredSearchItem = this.$refs.versesTable.$children[0]
        .filteredItems
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
      if (this.includeTab) {
        tabHeight = -20
      }
      var heightDif = this.windowHeight - 232 + tabHeight
      return heightDif
    },
    removeItem (item) {
      this.$store.commit('deleteFromAdvancedSearch', item.verseNumberToQuran)
    },
    highlight (text, searchValue) {
      if (!searchValue) {
        return text
      }
      return text.replace(new RegExp(searchValue, 'gi'), (match) => {
        return '<span style="background:yellow">' + match + '</span>'
      })
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
      if (this.fileName) {
        return this.fileName
      }
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
    console.log(this.$gtag.pageview(this.$route))
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
/* .groupHeader {
  height: 26px;
  font-weight: bold;
  font-size: 12px;
} */
.detailIcon {
  display: none;
  border: 1px solid;
  border-radius: 15px;
  margin-right: -6px;
  width: 27px;
}
.detailIcon:hover {
  background: #ccc;
}
.activeIcon {
  display: block;
}
.indexNumber.activeIcon {
  display: none !important;
}
</style>
