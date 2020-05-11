<template>
  <div class="d-flex search">
    <v-autocomplete
      class="mr-12"
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      clearable
      clear-icon
      hide-details
      item-text="verseText"
      label="ابحث  في الكتاب.."
      outlined
      flat
      auto-select-first
      deletable-chips
      multiple
      autofocus
      ref="autocomplete"
      filled 
      color="green darken-4"
      auto-overflow
      prepend-inner-icon="mdi-magnify"
    >
    <!-- :filter="customFilter" -->


      <template v-slot:selection="{ attr, on, item, selected }">
        <v-chip
          v-bind="attr"
          :input-value="selected"
          color="green lighten-1"
          class="white--text"
          v-on="on"
          close
          click:close
        >
          <v-icon small left>mdi-text-short</v-icon>
          <span v-text="item.sura"></span>
          <span class="mr-2" v-text="item.verseNumber"></span>
        </v-chip>
      </template>

      <template v-slot:append>
      <div v-show="search"> عدد مرات ورود   
        "<strong> {{search}}</strong>"
         = "<strong>{{resultsCount}}</strong>"
      </div>
      </template>

      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
             ابحث عن آية أو كلمة أو حرف أو رقم في 
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
          <v-list-item-title class="blue--text" v-html="highlight(item.sura)"></v-list-item-title>
          <v-list-item-title style="max-width=200px !important" v-html="highlight(item.verseText)"></v-list-item-title>
          <v-list-item-subtitle>
            ترتيب في المصحف: {{item.verseNumberToQuran}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn class="green lighten-1 caption" dark @click="runInSura(item)">
            <!-- فتح في {{item.sura}}  -->
             <v-icon class="" small>mdi-book-open-page-variant</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
// @ is an alias to /src
import { fetchSearchData } from "@/api/api.js";

export default {
  name: "autoComplete",
  components: {  },
  created(){
  let appApi = process.env.VUE_APP_API_URL;
  fetchSearchData(appApi).then(items => {
    this.items = items
    this.isLoading = false
  });
},
  data: () => ({
    isLoading: true,
    items: [],
    model: null,
    search: null
  }),
  methods:{
    highlight(text) {
      this.isLoading = false
      if(!this.search) {
        return text;
      }
      return text.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText" style="background:"yellow">' + match + '</span>';
      });
    },
    runInSura(item){
      let fileName = item.sura
      let suraNumber = item.suraNumber
      let verseNumber = item.verseNumber
      if(suraNumber <10){
        fileName = (("00" + suraNumber).slice(-3)) + fileName
        this.$store.state.fileName = fileName
      }
      else if((suraNumber) >10 && (suraNumber <99)){
        fileName = (("0" + suraNumber).slice(-3)) + fileName
        this.$store.state.fileName = fileName
      }
      else{
        this.$store.state.fileName = fileName + suraNumber
      }
      this.$refs.autocomplete.blur()
      this.$store.commit('setTargetedVerse', verseNumber)
      //  = true
    },
    // customFilter (item, queryText) {
    //   const textOne = item.verseText 
    //   const textTwo = item.verseNumber
    //   // const textThree = item.suraNumber
    //   const textFour = item.sura
    //   const searchText = queryText.toString()

    //   return textOne.indexOf(searchText) > -1 ||
    //     textTwo ||
    //     // textThree.indexOf(searchText) > -1 ||
    //     textFour.indexOf(searchText) > -1
    // },    
  },
  computed: {
    resultsCount(){
      if(this.search==null) return
      return this.$refs.autocomplete.filteredItems.length
    }
  },
  watch: {
    search () {
      if (this.items.length > 0) return
    },
  }
};
</script>

<style >
.search{
  width: 550px;
}
span.highlightText{
  background: yellow;
}
.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
    max-width: 500px;
}
</style>
