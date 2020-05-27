<template>
  <div class="d-flex search">
    <v-autocomplete
      class="mr-12 mt-8"
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      clearable
      item-text="verseText"
      label="ابحث  في الكتاب.."
      outlined
      flat
      ref="autocomplete"
      filled
      color="green darken-4"
      multiple
      prepend-inner-icon="mdi-magnify"
      :disabled="isDisabled"
      :suffix="resultsCount"
      :auto-select-first=false
    >
        <!-- <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="remove(data.item)"
            > -->
      <template v-slot:selection="{ attr, on, item }">
        <v-chip
          v-bind="attr"
          color="green lighten-1"
          class="white--text"
          close
          @click:close="remove(item)"
          @click="runSuraText(item)"
        >
          <v-icon small left>mdi-text-short</v-icon>
          <span v-text="item.sura">{{search}}</span>
          <span class="mr-2" v-text="item.verseNumber"></span>
        </v-chip>
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
        <v-chip
          label
          small
          color="indigo-lighten-5"
          class="ml-4 font-weight-light black--text"
        >
          <div class="">آية {{ item.verseNumber }}</div>
        </v-chip>
        <v-list-item-content>
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
      </template>
    </v-autocomplete>
          <!-- <template v-slot:prepend> -->
        <v-row v-show="search">
        عدد مرات ورود
        "<strong> {{search}}</strong>"
         = "<strong>{{resultsCount}}</strong>"
      </v-row>
      <!-- </template> -->
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
    isDisabled: false
  }),
  methods: {
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
    remove (item) {
      const index = this.model.indexOf(item.verseText)
      if (index >= 0) this.model.splice(index, 1)
    },
    runSuraText (item) {
      this.$store.state.fileName = item.sura

      const verseNumber = item.verseNumber
      this.$store.commit('setTargetedVerse', verseNumber)

      if (this.search !== null) {
        var searchedItem = { resultsCount: this.resultsCount, searchedString: this.search }
        this.$store.commit('setSearchedObject', searchedItem)
      }
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
      } return duplicates
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
.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
    max-width: 500px;
}
</style>
