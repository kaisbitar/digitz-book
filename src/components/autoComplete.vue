<template>
  <div class="d-flex search">
    <!-- <span class="mt-10 mr-8"></span> -->
    <v-autocomplete
      class="mr-12 mt-8"
      v-model="model"
      :items="items"
      item-value="search"
      item-text="verseText"
      :loading="isLoading"
      :search-input.sync="search"
      clearable
      label="ابحث  في الكتاب.."
      outlined
      flat
      ref="autocomplete"
      filled
      color="green darken-4"
      prepend-inner-icon="mdi-magnify"
      :suffix="resultsCount"
      :auto-select-first=false
      :disabled="isDisabled"
    >
      <!-- solution to close the list if needed:disabled="isDisabled" -->
      <template v-slot:selection="">
        <span
         :key="index" v-for="(searchItem, index) in searchedObject"
        >
          <v-badge
          color="green white--text"
          :content="searchItem.resultsCount"
          class="font-weight-bold title"
          ></v-badge>
          <v-chip
          label=""
          color="deep-purple darken-1"
          class="white--text"
          @click="showSearch(index)"
          @click:close="remove(index)"
          close
          >
            <span class="white--text">{{searchItem.searchedText}}</span>
          </v-chip>
        </span>
      </template>

      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            ابحث عن آية أو كلمة أو حرف في
            <strong>المصحف</strong>
          </v-list-item-title>
        </v-list-item>
      </template>

      <template v-slot:item="{ item }">
        <span style="display:contents" @click="captureSearch(item)">
          <v-chip
            label
            small
            color="indigo-lighten-5"
            class="ml-4 font-weight-light black--text"
          >
            <div class="">آية {{ item.verseNumber }}</div>
          </v-chip>
          <v-list-item-content >
            <v-list-item-title
              class="blue--text"
              v-html="highlight(item.sura)"
            ></v-list-item-title>
            <v-list-item-title style="max-width=200px !important" v-html="highlight(item.verseText)"></v-list-item-title>
            <v-list-item-subtitle>
              ترتيب في المصحف: {{item.verseNumberToQuran}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn class="green lighten-1 caption" dark @click="runSuraText(item)">
              <!-- الآية -->
              <v-icon class="" small>mdi-book-open-page-variant</v-icon>
            </v-btn>
          </v-list-item-action>
        </span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
// @ is an alias to /src
import { fetchSearchData } from '@/api/api.js'

export default {
  name: 'autoComplete',
  components: { },
  created () {
    const appApi = process.env.VUE_APP_API_URL
    fetchSearchData(appApi).then(items => {
      this.items = items
      this.isLoading = false
    })
  },
  data: () => ({
    isLoading: true,
    items: [],
    model: null,
    search: null,
    searchedText: null,
    isDisabled: false
  }),
  methods: {
    captureSearch () {
      // if (this.search == null) { this.runSuraText(item) }
      if (this.searchedText === this.search) return
      this.searchedText = this.search
      var searchedItem = { resultsCount: this.resultsCount, searchedText: this.searchedText }
      this.$store.commit('setSearchedObject', searchedItem)
      var filterdSearchItem = this.$refs.autocomplete.filteredItems
      this.showSearch(this.$store.state.searchedObject.length - 1)
      filterdSearchItem.searchTerms = (searchedItem)
      this.$store.commit('setFilteredSearch', filterdSearchItem)
    },
    showSearch (index) {
      // if (this.model !== null) {
      // if (this.$router.currentRoute.name !== 'search') {
      //   this.$router.push({ name: 'search' })
      // }
      this.$store.commit('setSelectedSearch', index)
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 100)
      this.$refs.autocomplete.blur()
    },
    remove (index) {
      if (!this.model) return
      // console.log(index)
      // if (index >= 0) { this.model.splice(index, 1) }
      this.$store.commit('removeSearchedItem', index)
      this.$store.commit('removeFilteredItem', index)
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 100)
      this.$refs.autocomplete.blur()
    },
    highlight (text) {
      if (!this.search) {
        return text
      }
      var searchWordPosition = (text.indexOf(this.search))
      if (searchWordPosition > 50) {
        var suraChunk = '..' + text.slice(searchWordPosition - 20, 300)
      } else {
        suraChunk = text
      }
      return suraChunk.replace(new RegExp(this.search, 'gi'), match => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    },
    runSuraText (item) {
      this.$store.state.fileName = item.sura
      const verseNumber = item.verseNumber
      this.$store.commit('setTargetedVerse', verseNumber)
      // this.$router.push({ name: 'Single Sura' })
      if (this.model !== null) {
        this.isDisabled = true
        setTimeout(() => {
          this.isDisabled = false
        }, 100)
      }
      this.$refs.autocomplete.blur()
    }
  },
  computed: {
    searchedObject () {
      if (this.$store.state.searchedObject === null) return null
      var searchedObject = this.$store.state.searchedObject
      return searchedObject
    },
    resultsCount () {
      if (this.search == null) return null
      if (this.$refs.autocomplete.filteredItems.length == null) return null
      var count = this.$refs.autocomplete.filteredItems.length + this.searchDuplicates

      return count.toString()
    },
    searchDuplicates () {
      if (this.search == null) return null
      if (this.search.length >= 3) {
        var duplicates = 0
        var results = this.$refs.autocomplete.filteredItems
        results.map(item => {
          var matches = item.verseText.match(new RegExp(this.search, 'gi'))
          if (matches !== null) {
            duplicates = (matches).length - 1
          }
        })
      } else {
        duplicates = 0
      }

      return duplicates
    }
  },
  watch: { }
}
</script>

<style >
.search{
  /* width: 900px; */
  min-width: 413px;
}
span.highlightText{
  background: yellow;
}
/* .v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
    max-width: 500px;
} */
.v-badge__wrapper {
    left: 0px !important;
    top: -15px !important;
    z-index: 2;
}
</style>
