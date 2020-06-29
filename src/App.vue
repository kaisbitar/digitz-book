<template>
  <v-app>

    <v-navigation-drawer v-model="drawer" app right>
      <siteMenu/>
    </v-navigation-drawer>

    <v-app-bar  app :height="100" color="#BBDEFB" >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title >الكتاب المرقوم</v-toolbar-title>
      </div>
      <autoComplete/>
    </v-app-bar>
    <v-content>
      <v-chip label class="mr-2 mt-2 mb-1" v-if="searchedWord" large @click="showSearch= !showSearch">{{searchedWord}}</v-chip>
      <v-card v-if="searchedWord" class="mr-2 mb-n9 searchWrap ">
       <v-expand-transition>
          <div v-show="showSearch">
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <search-view class="searchComp"/>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
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
      var filteredLists = this.$store.state.filteredSearch[this.$store.state.selectedSearch]
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
  }
}
</script>

<style lang="scss">
  @import 'styles/styles.scss';

  .v-application{
    font-family: $body-font-family !important;
  }
  .v-btn {
    letter-spacing: 0px !important;
  }
  a {
    text-decoration: none;
  }
  .searchWrap{
    position: absolute !important;
    width: 455px;
    z-index: 2;
  }
  .searchComp{
    // position: fixed;
    /* width: 500px; */
    z-index: 5;
    max-height: 415px;
    // overflow-y: scroll;
    // /* margin-right: 745px;
  }
</style>
