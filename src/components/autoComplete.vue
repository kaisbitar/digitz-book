<template>
  <!-- :prefix="resultsCount()" -->
  <div fluid class="d-flex autoWrap webKitWidth">
    <div class="webKitWidth">
      <v-autocomplete
        :filter="handleFiltering"
        :items="storedItems"
        :search-input.sync="search"
        :hide-no-data="!search"
        item-text="verseText"
        item-value="verseNumberToQuran"
        :disabled="isDisabled"
        :color="'blue darken-4'"
        prepend-inner-icon="mdi-magnify"
        label="ابحث  في الكتاب.."
        ref="autocomplete"
        v-on:keyup.enter="handleShowAll()"
        @click:clear="handleRemoveAllChips()"
        clearable
      >
        <template v-slot:no-data>
          <p class="pa-1 red--text">لا يوجد معلومات تطابق البحث!</p>
        </template>

        <template v-slot:selection disabled> </template>

        <template v-slot:prepend-inner>
          <div class="d-flex" @click.prevent="disableInputBox()">
            <autoCompleteSearchBar />
          </div>
          <span v-if="search && matchAll" class="matchLabel mt-2">تطابق</span>
          <v-icon
            v-if="search"
            @click="matchAll = !matchAll"
            :color="matchAll === false ? 'grey lighten-1' : 'blue'"
            class="mt-1"
          >
            mdi-format-letter-matches
          </v-icon>
        </template>

        <template v-slot:item="{ item }">
          <div class="d-flex autoCompleteList">
            <autoCompleteItem
              :item="item"
              :inputText="search"
              @clicked="handleShowAll()"
            />
          </div>
        </template>

        <template v-slot:prepend-item>
          <v-row class="mb-3 mr-4 btnsBar">
            <v-btn
              small
              @click="handleShowAll()"
              class="green lighten-2 white--text"
              >إبحث</v-btn
            >
            <v-card
              class="elevation-0 searchLabel label mr-4 pl-2 pr-2"
              outlined
            >
              <span v-if="search" class="yellow ml-1">"{{ search }}" </span>
              <span class="title mt-n6"> {{ resultsCount() }}</span> آية
            </v-card>
            <div v-if="selectedSearchIndex > -1" class="mr-4">
              أو
              <v-btn
                small
                @click="handleAddToList()"
                class="blue lighten-2 white--text mr-4"
                >ضِف للبحث الحالي</v-btn
              >
            </div>
          </v-row>
        </template>
      </v-autocomplete>
    </div>
  </div>
</template>

<script>
import autoCompleteItem from './autoCompleteItem'
import autoCompleteSearchBar from './autoCompleteSearchBar'

export default {
  name: 'autoComplete',
  components: {
    autoCompleteItem,
    autoCompleteSearchBar
  },
  data: () => ({
    isLoading: true,
    search: null,
    isDisabled: false,
    matchAll: false
  }),
  methods: {
    handleShowAll () {
      if (!this.search) return
      this.setFilteredSearchItem()
      // if (this.$router.currentRoute.name !== 'search') {
      //   this.$router.push({ name: 'search' })
      // }
    },
    setFilteredSearchItem () {
      var searchResults = this.$refs.autocomplete.filteredItems
      var internalSearch = this.$refs.autocomplete.internalSearch
      var selectedSearchIndex = this.$store.getters.filteredSearch.length
      var value = {
        resultsCount: searchResults.length,
        inputText: internalSearch,
        parentSearch: null,
        result: searchResults,
        isSelected: true
      }
      this.$store.commit('setFilterSelectedSearch', value)
      this.$store.commit('setFilteredSearchItem', value)
      this.$store.commit('setFilterSelectedIndex', selectedSearchIndex)
      this.disableInputBox()
    },
    handleAddToList () {
      var searchResults = this.$refs.autocomplete.filteredItems
      var search = this.$refs.autocomplete.internalSearch
      this.$store.commit('addToAdvancedSearch', { searchResults, search })
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
    }
  },
  created () {
    // this.search = this.inputText
  },
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
