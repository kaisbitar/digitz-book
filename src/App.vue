<template>
  <v-app>

    <v-navigation-drawer v-model="drawer" app right>
      <siteMenu/>
    </v-navigation-drawer>

    <v-app-bar class="topHeader"  app :height="80" color="#BBDEFB" >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="ma-5 mt-9 align-center">
        <div class="text-sm-body-2 " >الكتاب المرقوم</div>
      <autoComplete/>
      </div>
    </v-app-bar>

    <v-content>

      <!-- <v-card v-if="searchedWord" class="mr-2 mt-1 searchWrap "> -->
       <v-expand-transition>
          <div v-show="showSearch" class="searchWrap ">
            <!-- <v-divider></v-divider> -->
            <!-- <v-card-text class=""> -->
              <v-label label class="">نتائج بحث: <b>{{searchedWord}}</b></v-label>
              <search-view class="searchComp"/>
            <!-- </v-card-text> -->
          </div>
        </v-expand-transition>
      <!-- </v-card> -->
      <span @click="showSearch= false"><router-view/></span>
    </v-content>

    <v-footer id="footer" href="#footer">All rights reserved @2020</v-footer>
  </v-app>
</template>

<script>
import siteMenu from './components/siteMenu.vue'
import autoComplete from './components/autoComplete.vue'
import searchView from './components/searchResult.vue'

export default {
  name: 'App',

  components: {
    siteMenu,
    autoComplete,
    searchView
  },

  data: () => ({
    drawer: false,
    showSearch: true
  }),
  computed: {
    searchedWord () {
      if (this.$store.getters.filteredSearch.length === 0) return
      var filteredLists = this.$store.getters.filteredSearch[this.$store.state.selectedSearch]
      console.log(filteredLists)
      if (!filteredLists) return null
      else return filteredLists.searchTerms.searchedText
    }
  },
  mounted () {
    this.$store.watch(
      state => state.targetedVerse,
      () => {
        this.showSearch = false
      })
    this.$store.watch(
      state => state.selectedSearch,
      () => {
        this.showSearch = true
      })
  },
  created () {
    this.$store.commit('resetFilteredItems')
    this.$store.commit('resetSearchedObject')
  }
}
</script>

<style lang="scss">
  @import 'styles/styles.scss';
  html{
    zoom: 1.2;
  }
  .v-application{
    font-family: $body-font-family !important;
  }
  .v-btn {
    letter-spacing: 0px !important;
  }
  a {
    text-decoration: none;
  }
  .topHeader{
    z-index: 6;
  }
  .searchWrap{
    // position: absolute !important;
    // width: 455px;
    // z-index: 2;
    max-width: 1060px !important;
    margin-top: 19px !important;
    z-index: 5;
  }
  .searchComp{
    // position: fixed;
    /* width: 500px; */
    z-index: 3;
    max-height: 415px;
    // overflow-y: scroll;
    // /* margin-right: 745px;
  }
  .v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
    max-width: 353px;
    // left: 178px !important;
}
</style>
