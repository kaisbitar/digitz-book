<template>
  <v-app >
    <v-navigation-drawer v-model="drawer" app right class="grey lighten-4">
      <!-- <siteMenu /> -->
      <quranIndex />
    </v-navigation-drawer>

    <v-app-bar
      class="topHeader brown lighten-5"
      flat
      app
      :height="71"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"> </v-app-bar-nav-icon>
      <h3 class="titleText ml-2 font-weight-thin">الكتاب المرقوم</h3>
      <autoComplete class="mt-3" />
    </v-app-bar>
    <v-main>
      <!-- <autoCompleteSearchBar /> -->
      <!-- <keep-alive include="search"> -->
        <router-view />
      <!-- </keep-alive> -->

    </v-main>

    <!-- <v-footer id="footer" href="#footer" class="caption pa-0"
      >حقوق النشر غير محفوظة</v-footer -->
    >
  </v-app>
</template>

<script>
// import siteMenu from './components/siteMenu.vue'
import autoComplete from './components/autoComplete.vue'
import quranIndex from './components/quranIndex.vue'
// import autoCompleteSearchBar from './components/autoCompleteSearchBar'
export default {
  name: 'App',

  components: {
    // siteMenu,
    autoComplete,
    quranIndex
    // autoCompleteSearchBar
  },

  data: () => ({
    drawer: true
  }),
  computed: {
    searchedWord () {
      if (this.$store.getters.filteredSearch.length === 0) return
      var filteredLists = this.$store.getters.filteredSearch[
        this.$store.state.filterSelectedIndex
      ].result
      if (!filteredLists) return null
      else return filteredLists.searchTerms.searchedText
    }
  },
  mounted () {},
  created () {
    // this.$store.commit('resetFilteredItems')
    this.$store.commit('resetFilterSelectedIndex')
  }
}
</script>

<style lang="scss">
@import "styles/styles.scss";
html {
  // zoom: 1.0;
}
.topHeader{
  height: 58px !important;
}
.v-application {
  font-family: $body-font-family !important;
}
.topHeader {
  z-index: 6;
}
#footer {
  width: 100%;
  direction: ltr;
  bottom: 0;
  left: 0;
  position: fixed;
  background: #f5f5f5;
  z-index: 22;
  color: black;
}
.titleText {
  width: 148px;
}
/************ Responseive***********/
@media (max-width: 600px) {
  .titleText {
    font-size: 15px;
  }
  .autoAndLogo {
    display: block !important;
  }
  .searcj {
    margin-top: -44px !important;
  }
}
</style>
