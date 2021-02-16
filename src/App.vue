<template>
  <v-app>

    <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right class="grey lighten-4">
      <tableQuranIndex @showDetailToggle="calculateWidth"/>
    </v-navigation-drawer>

    <v-app-bar class="topHeader brown lighten-5" flat app :height="71">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"> </v-app-bar-nav-icon>
      <h3 class="titleText ml-2 font-weight-thin">الكتاب المرقوم</h3>
      <autoComplete class="mt-3" />
    </v-app-bar>
    <v-main class="mainWrap">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import autoComplete from './components/autoComplete.vue'
import tableQuranIndex from './components/tableQuranIndex.vue'
export default {
  name: 'App',

  components: {
    autoComplete,
    tableQuranIndex
  },

  data: () => ({
    drawer: true,
    drawerWidth: 250
  }),
  methods: {
    calculateWidth (showDetail) {
      if (showDetail === false) this.drawerWidth = 250
      if (showDetail === true) this.drawerWidth = 440
    }
  },
  computed: {
    searchedWord () {
      if (this.$store.getters.filteredSearch.length === 0) return
      var filteredLists = this.$store.getters.filteredSearch[
        this.$store.state.filterSelectedIndex
      ].result
      if (!filteredLists) return null
      else return filteredLists.searchTerms.searchedText
    },
    drawerFlag () {
      return this.$store.getters.drawerState
    }
  },
  watch: {
    drawerFlag () {
      this.drawer = this.drawerFlag
    }
  },
  updated () {},
  mounted () {},
  created () {
    this.$store.commit('resetFilterSelectedIndex')
  }
}
</script>

<style lang="scss">
@import "styles/styles.scss";
.mainWrap {
  margin-top: -2px;
}
.topHeader {
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
