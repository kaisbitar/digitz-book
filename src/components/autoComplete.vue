<template>
  <div class="d-flex autoWrap webKitWidth">
    <v-autocomplete
      :search-input.sync="search"
      :filter="handleFiltering"
      :hide-no-data="!search"
      :disabled="isDisabled"
      :items="storedItems"
      @click:clear="handleRemoveAllChips()"
      v-on:keyup.enter="handleNewSearch()"
      prepend-inner-icon="mdi-magnify"
      background-color="#fff"
      item-value="verseNumberToQuran"
      item-text="verseText"
      :color="'blue darken-4'"
      label="ابحث  في الكتاب.."
      ref="autocomplete"
      class="autoBox"
      clearable
      flat
      dense
      multiple
      solo
    >
      <template v-slot:no-data>
        <p class="pa-1 red--text">لا يوجد معلومات تطابق البحث!</p>
      </template>

      <template v-slot:selection disabled> </template>

      <template v-slot:prepend-inner>
        <div class="d-flex" @click.prevent="disableInputBox()">
          <autoCompleteChipsBar
            :chipsData="SearchResults"
            :selectedChipIndex="selectedSearchIndex"
            @chipClicked="handleClickedChip"
            @chipRemoved="handleRemovedChip"
          />
        </div>
        <appSearchBoxMatch
          :search="search"
          :matchingStatus="matchingStatus"
          @clicked="matchingStatus = !matchingStatus"
        />
      </template>

      <template v-slot:item="{ item }">
        <div class="d-flex autoCompleteList">
          <autoCompleteItem
            :inputText="search"
            :item="item"
            :chipTitle="' آية ' + item.verseIndex"
            :subtitle="
              'ترتيب في المصحف:' +
              highlight(item.verseNumberToQuran.toString(), search)
            "
            :mainText="highlight(item.verseText, search)"
            :title="highlight(item.fileName, search)"
            @clicked="handleSingleItemClicked(item)"
          />
        </div>
      </template>

      <template v-slot:prepend-item>
        <autoCompleteOptionsBar
          class="btnsBar"
          @btn1Clicked="handleNewSearch()"
          :resultCounter="resultsCount()"
          :secondBtnCondition="selectedSearchIndex"
          :textValue="search"
          :btn1Title="'إبحث'"
          :btn2Title="'ضِف للبحث الحالي'"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import autoCompleteOptionsBar from './autoCompleteOptionsBar'
import autoCompleteChipsBar from './autoCompleteChipsBar'
import appSearchBoxMatch from './appSearchBoxMatch'
import autoCompleteItem from './autoCompleteItem'

import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoComplete',
  mixins: [appMixin],
  components: {
    autoCompleteOptionsBar,
    autoCompleteChipsBar,
    appSearchBoxMatch,
    autoCompleteItem
  },
  data: () => ({
    isDisabled: false,
    matchingStatus: false,
    isLoading: true,
    search: null
  }),
  methods: {
    handleClickedChip (index) {
      this.$store.commit('setSearchIndex', index)
      this.checkAndGo('search')
    },
    handleRemovedChip (index) {
      this.$store.commit('removeSearchItem', index)
      if (index !== this.selectedSearchIndex) {
        this.$store.commit('setSearchIndex', this.selectedSearchIndex - 1)
        return
      }
      this.$store.commit('setSearchIndex', index - 1)
      this.checkAndGo('search')
    },
    handleRemoveAllChips () {
      this.$store.commit('resetSearchResults')
      this.checkAndGo('singleSura')
    },
    handleSingleItemClicked (item) {
      this.$store.commit('setTarget', {
        fileName:
          item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '') +
          item.fileName.replace(/[0-9]/g, ''),
        verseIndex: item.verseIndex
      })
      this.handleNewSearch()
    },
    handleNewSearch () {
      if (!this.search) return
      this.setNewSearch()
      this.checkAndGo('search')
    },
    setNewSearch () {
      var value = {
        resultsCount: this.$refs.autocomplete.filteredItems.length,
        inputText: this.$refs.autocomplete.internalSearch,
        result: this.$refs.autocomplete.filteredItems,
        parentSearch: null
      }
      this.$store.commit('setSearchIndex', this.SearchResults.length)
      this.$store.commit('setSearchResultsItem', value)
      this.disableInputBox()
    },
    disableInputBox () {
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 10)
      this.$refs.autocomplete.blur()
    },
    handleFiltering (item, queryText, itemText) {
      itemText = ' ' + itemText + ' '
      if (!this.matchingStatus && itemText.match(queryText) !== null) {
        return itemText
      }
      return itemText.match(
        new RegExp(
          '([^\u0621-\u064A]+' + queryText + '[^\u0621-\u064A]+)',
          'gim'
        )
      )
    },
    resultsCount () {
      if (!this.$refs.autocomplete) return
      return this.$refs.autocomplete.filteredItems.length.toString()
    },
    checkAndGo (route) {
      if (this.$router.currentRoute.name !== route) {
        this.$router.push({ name: route })
      }
    }
  },
  computed: {
    storedItems () {
      return this.$store.getters.oneQuranFile
    },
    selectedSearch () {
      return this.$store.getters.selectedSearch
    },
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    },
    inputText () {
      if (!this.selectedSearch) return
      return this.selectedSearch.inputText
    },
    SearchResults () {
      if (this.$store.getters.SearchResults === null) return
      return this.$store.getters.SearchResults
    }
  },
  watch: {
    inputText () {
      this.search = this.inputText
    },
    selectedSearchIndex () {
      if (this.selectedSearchIndex === -1) return
      this.search = this.inputText
      this.$store.commit('setTarget', {
        fileName:
          this.selectedSearch.result[0].fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '') +
          this.selectedSearch.result[0].fileName.replace(/[0-9]/g, ''),
        verseIndex: this.selectedSearch.result[0].verseIndex
      })
    }
  },
  mounted () {},
  updated () {}
}
</script>

<style>
.autoWrap {
  margin-right: 39px;
}
.v-text-field__prefix {
  color: #b7b7b9;
  font-size: 16px;
  margin-top: 9px;
}
.v-select__selections input {
  padding-top: 18px !important;
}
.searchLabel {
  padding-top: 2px;
  border-radius: 4px !important;
  margin-top: -7px;
  padding-bottom: 6px;
}
.btnsBar {
  position: sticky;
  top: 0px;
  z-index: 1;
  background: white;
  height: 35px;
  padding-top: 11px;
  padding-bottom: 42px;
}
</style>
