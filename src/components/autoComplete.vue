<template>
  <div class="d-flex autoWrap webKitWidth">
    <v-autocomplete
      :search-input.sync="search"
      :filter="handleFiltering"
      :hide-no-data="!search"
      :disabled="isDisabled"
      :items="storedItems"
      @click:clear="handleRemoveAllChips()"
      v-on:keyup.enter="handleShowAll()"
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
            :chipsData="filteredSearch"
            :selectedChipIndex="selectedSearchIndex"
            @chipClicked="handleClickedChip"
            @chipRemoved="handleRemovedChip"
          />
        </div>
        <appSearchBoxMatch
          :search="search"
          :matchAll="matchAll"
          @clicked="matchAll = !matchAll"
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
          @btn1Clicked="handleShowAll()"
          @btn2Clicked="handleAddToList()"
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
    matchAll: false,
    isLoading: true,
    search: null
  }),
  methods: {
    handleSingleItemClicked (item) {
      var suraNumber = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
      var suraName = item.fileName.replace(/[0-9]/g, '')
      var target = {
        fileName: suraNumber + suraName,
        verseIndex: item.verseIndex
      }
      this.$store.commit('setTarget', target)
      this.handleShowAll()
    },
    handleShowAll () {
      if (!this.search) return
      this.setFilteredSearchItem()

      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
    },
    handleClickedChip (index) {
      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
      this.$store.commit('setFilterSelectedSearch', this.selectedFilterList)
      this.$store.commit('setFilterSelectedIndex', index)
    },
    handleRemovedChip (index) {
      this.$store.commit('setFilterSelectedSearch', this.selectedFilterList)
      this.$store.commit('setFilterSelectedIndex', index - 1)
      this.$store.commit('removeFilteredItem', index)
    },
    setFilteredSearchItem () {
      var value = {
        resultsCount: this.$refs.autocomplete.filteredItems.length,
        inputText: this.$refs.autocomplete.internalSearch,
        result: this.$refs.autocomplete.filteredItems,
        parentSearch: null,
        isSelected: true
      }
      this.$store.commit(
        'setFilterSelectedIndex',
        this.$store.getters.filteredSearch.length - 1
      )
      this.$store.commit('setFilterSelectedSearch', value)
      this.$store.commit('setFilteredSearchItem', value)
      this.disableInputBox()
    },
    handleAddToList () {
      var results = this.$refs.autocomplete.filteredItems
      var search = this.$refs.autocomplete.internalSearch
      this.$store.commit('addToAdvancedSearch', { results, search })
    },
    addItemToResults (item) {
      if (this.selectedSearchIndex < 0) {
        var value = {
          resultsCount: 1,
          inputText: '',
          parentSearch: 'بحث خاص',
          result: [item],
          isAdvanced: true,
          isSelected: true
        }
        this.$store.commit('setFilteredSearchItem', value)
        return
      }
      this.$store.commit('addToAdvancedSearch', item)
    },
    deleteItemFromResults (item) {
      this.$store.commit('deleteFromAdvancedSearch', item.verseNumberToQuran)
    },
    disableInputBox () {
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 100)
      this.$refs.autocomplete.blur()
    },
    handleRemoveAllChips () {
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
      this.$store.commit('resetFilteredItems')
      this.$store.commit('resetFilterSelectedIndex')
      this.$store.commit('resetFilterSelectedSearch')
    },
    handleFiltering (item, queryText, itemText) {
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
    resultsCount () {
      if (!this.$refs.autocomplete) return
      return this.$refs.autocomplete.filteredItems.length.toString()
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
    filteredSearch () {
      if (this.$store.getters.filteredSearch === null) return
      var filteredSearch = this.$store.getters.filteredSearch
      return filteredSearch
    },
    selectedFilterList () {
      return this.filteredSearch[this.selectedChipIndex]
    }
  },
  created () {},
  watch: {
    inputText () {
      this.search = this.inputText
    },
    selectedSearchIndex () {
      this.search = this.inputText
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
  /* height: 20px; */
  padding-top: 2px;
  border-radius: 4px !important;
  margin-top: -7px;
  padding-bottom: 6px;
}
.v-input__control {
  /* height: 52px !important;
  margin-bottom: 21px; */
}
.v-input__slot {
  /* background: white; */
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
