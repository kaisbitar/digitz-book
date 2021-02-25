<template>
  <div fluid class="d-flex autoWrap webKitWidth">
    <div class="webKitWidth">
      <v-autocomplete
        :filter="handleFiltering"
        :items="storedItems"
        :search-input.sync="inputText"
        :hide-no-data="!inputText"
        item-text="verseText"
        item-value="verseNumberToQuran"
        :disabled="isDisabled"
        :prefix="resultsCount()"
        :color="'blue darken-4'"
        prepend-inner-icon="mdi-magnify"
        label="ابحث  في الكتاب.."
        ref="autocomplete"
        v-on:keyup.enter="handleShowAll()"
        @click:clear="handleRemoveAllChips()"
        clearable
        selection.disabled="false"
      >
        <template v-slot:no-data>
          <p class="pa-1 red--text">لا يوجد معلومات تطابق البحث!</p>
        </template>

        <template v-slot:selection disabled> </template>

        <template v-slot:prepend-inner>
          <div class="d-flex" @click.prevent="disableInputBox()">
            <autoCompleteSearchBar />
          </div>
          <v-icon
            v-if="inputText"
            @click="matchAll = !matchAll"
            :color="matchAll === false ? 'grey lighten-1' : 'blue'"
            class="mt-1"
          >
            mdi-format-letter-matches
          </v-icon>
        </template>

        <template v-slot:item="{ item }">
          <div class="d-flex" @click="handleClickWithInput()">
            <autoCompleteList :item="item" :inputText="inputText" />
          </div>
        </template>
      </v-autocomplete>
    </div>
    <div v-if="inputText">
      <v-btn
        small
        @click="handleShowAll()"
        class="green lighten-2 white--text caption mt-1 mr-2"
        >جميع النتائج</v-btn
      >
    </div>
  </div>
</template>

<script>

import autoCompleteList from './autoCompleteList'
import autoCompleteSearchBar from './autoCompleteSearchBar'

export default {
  name: 'autoComplete',
  components: {
    autoCompleteList,
    autoCompleteSearchBar
  },
  data: () => ({
    isLoading: true,
    inputText: null,
    isDisabled: false,
    matchAll: false
  }),
  methods: {
    handleClickWithInput () {
      // if (!this.inputText) return

      this.setFilteredSearch()
      this.setfilterSelectedIndex()
      this.disableInputBox()
    },
    handleShowAll () {
      if (!this.inputText) return

      this.setFilteredSearch()
      this.setfilterSelectedIndex()

      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
      this.disableInputBox()
    },
    setfilterSelectedIndex () {
      var filterSelectedIndex = this.$store.getters.filteredSearch.length - 1
      this.$store.commit('setFilterSelectedIndex', filterSelectedIndex)
    },
    setFilteredSearch () {
      var filteredSearchItem = this.$refs.autocomplete.filteredItems
      var internalSearch = this.$refs.autocomplete.internalSearch

      var value = {
        resultsCount: filteredSearchItem.length,
        inputText: internalSearch,
        result: filteredSearchItem
      }

      this.$store.commit('setFilteredSearch', value)
      console.log(internalSearch)
    },
    disableInputBox () {
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 100)
      this.$refs.autocomplete.blur()
      // this.inputText = null
    },
    handleRemoveAllChips () {
      this.$store.commit('resetFilteredItems')
      this.$store.commit('resetFilterSelectedIndex')
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    handleFiltering (item, queryText, itemText) {
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
    resultsCount () {
      if (!this.$refs.autocomplete) return
      return this.$refs.autocomplete.filteredItems.length.toString()
    }
  },
  computed: {
    storedItems () {
      return this.$store.getters.oneQuranFile
    }
  },
  created () {
  },
  watch: {},
  mounted () {},
  updated () {}
}
</script>

<style lang="scss">
// label.v-label.theme--light {
//   color: #afafaf;
// }
.autoWrap {
  margin-right: 39px;
}
.v-text-field__prefix {
  color: #b7b7b9;
  font-size: 19px;
}
// label.v-label.theme--light {
//     font-size: 20px  !important;
//     margin-top: -4px;
//     height: 23px;
// }
</style>
