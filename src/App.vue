<template>
  <v-app>

    <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right class="grey lighten-4">
      <tableQuranIndex @showDetailToggle="calculateWidth"/>
    </v-navigation-drawer>

    <v-app-bar class="topHeader brown lighten-5" flat app :height="71">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-progress-linear
        class="mt-12"
        color="blue"
        indeterminate
        rounded
        height="6"
        :active="isLoading"
        absolute
      ></v-progress-linear><h3 class="titleText ml-2 font-weight-thin">الكتاب المرقوم</h3>
      <autoComplete class="mt-3" />
    </v-app-bar>

    <v-main class="mainWrap">
      <div></div>
    <router-view v-if="!isLoading"/>
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
    drawerWidth: 250,
    isLoading: false
  }),
  methods: {
    calculateWidth (showDetail) {
      if (showDetail === false) this.drawerWidth = 250
      if (showDetail === true) this.drawerWidth = 440
    },
    async prepareData () {
      this.isLoading = true
      return new Promise((resolve) => {
        this.$store.dispatch('getQuranData')
        resolve()
      })
    }
  },
  computed: {
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
  mounted () { },
  created () {
    this.prepareData().then(() => {
      this.isLoading = false
    })
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
.arrowsWrap {
  width: -webkit-fit-content;
  margin-right: auto;
  margin-top: -85px;
}
.compWrapper {
  padding-right: 19px;
  padding-left: 19px;
}
.suraInfoBox {
  padding: 24px;
  margin-left: 10px;
  width: 181.5px;
  display: flex;
}

.numberInfo {
  width: 191px;
  margin-top: -9px;
}
.titleWrap {
  width: 259px;
  height: 94px;
  margin-right: -12px;
  margin-top: -9px;
}
.downArr {
  margin-top: 18px !important;
}
h5.basmaleh {
  width: 142px;
}
.charSwitch {
  margin-right: 56px;
  width: 72px;
  z-index: 2;
  margin-top: 14px;
}
.switchLabel {
  margin: auto;
  width: fit-content;
  /* grey lighten-1*/
  color: #BDBDBD
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
