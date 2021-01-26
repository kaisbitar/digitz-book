<template>
  <div fluid class="autoWrap">
    <div>
      <!-- :filter="handleFiltering" -->
      <v-autocomplete
        v-model="model"
        :items="storedItems"
        :search-input.sync="inputText"
        :hide-no-data="!inputText"
        item-text="verseText"
        :disabled="isDisabled"
        :suffix="resultsCount"
        :color="'blue darken-4'"
        prepend-inner-icon="mdi-magnify"
        label="ابحث  في الكتاب.."
        ref="autocomplete"
        v-on:keyup.enter="handleShowAll()"
        @click:clear="handleRemoveAllChips()"
        clearable
        selection.disabled="true"
      >
        <template v-slot:no-data>
          <p class="pa-1 red--text">لا يوجد معلومات تطابق البحث!</p>
        </template>

        <!-- <template v-slot:append>
              <v-btn @click="handleShowAll()" v-if="inputText"
                >جميع النتائج</v-btn
              >
            </template> -->
        <template v-slot:selection disabled> </template>

        <template v-slot:prepend-inner>
          <div class="d-flex" @click.prevent="disableInputBox()">
            <autoCompleteSearchBar />
          </div>
        </template>

        <template v-slot:item="{ item }">
          <div class="d-flex" @click="handleClickWithInput()">
            <autoCompleteList :item="item" :inputText="inputText" />
          </div>
        </template>
      </v-autocomplete>
    </div>
  </div>
</template>

<script>
import autoCompleteList from './autoCompleteList'
import { fetchSearchData } from '@/api/api.js'
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
    model: null
  }),
  methods: {
    handleClickWithInput () {
      if (!this.inputText) return

      this.setFilteredSearch()
      this.setFilteredSearchIndex()
      this.disableInputBox()
    },
    handleShowAll () {
      if (!this.inputText) return

      this.setFilteredSearch()
      this.setFilteredSearchIndex()

      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
      this.disableInputBox()
    },
    setFilteredSearchIndex () {
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
    },
    disableInputBox () {
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 100)
      this.$refs.autocomplete.blur()
    },
    handleRemoveAllChips () {
      this.$store.commit('resetFilteredItems')
      this.$store.commit('resetFilterSelectedIndex')
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    handleFiltering (item, queryText, itemText) {
      // return new RegExp('\\b' + queryText + '\\b').test(itemText)
      // queryText = '\\b' + queryText + '\\b'
      // var match = [...itemText.matchAll(queryText)]
      // return (match) || (match && itemText === match[0])
      // if (queryText === 'فبأي آ' && match.length !== 0)
    }
  },
  computed: {
    storedItems () {
      return this.$store.getters.autoCompleteItems
    },
    resultsCount () {
      if (!this.$refs.autocomplete) return
      return this.$refs.autocomplete.filteredItems.length
    }
  },
  created () {
    if (this.storedItems.length > 0) {
      this.isLoading = false
    } else {
      const appApi = process.env.VUE_APP_API_URL
      fetchSearchData(appApi).then((items) => {
        this.$store.commit('setAutoCompleteItems', items)
        this.isLoading = false
      })
    }
  },
  watch: {},
  mounted () {},
  updated () {}
}
</script>

<style lang="scss">
label.v-label.theme--light {
  color: #afafaf;
}
.autoWrap{
  margin-right: 39px;
}
// .enlarge {
//   animation: enlarge .5s linear;
// }
// @keyframes enlarge {
//   0% {
//     transform: scale(1);
//     height: 70px;
//   }
//   100% {
//     transform: scale(1.3);
//     height: 50px;
//   }
// }
</style>
