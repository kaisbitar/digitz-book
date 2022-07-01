<template>
  <v-app>
    <v-navigation-drawer
      :width="drawerWidth"
      v-model="drawer"
      app
      right
      class="grey lighten-4"
    >
      <tableQuranIndex @showDetailToggle="calculateWidth" />
    </v-navigation-drawer>

    <v-app-bar class="topHeader brown lighten-5" flat app :height="71">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer, toggleDrawer(drawer)"
      >
      </v-app-bar-nav-icon>
      <v-progress-linear
        class="mt-12"
        color="blue"
        indeterminate
        rounded
        height="6"
        :active="isLoading"
        absolute
      ></v-progress-linear>
      <h3 class="titleText ml-2 font-weight-thin">الكتاب المرقوم</h3>
      <autoComplete class="mt-3" />
    </v-app-bar>

    <v-main class="mainWrap" v-if="!isLoading">
      <div class="viewSwitch">
        <v-card
          :class="[{ activeView: activeView === 'detailView' }]"
          class="switchLabel"
          outlined
        >
          <div  @click="changeView()" class=" pl-2 pr-2" style="font-size:12px;">detailView</div>
        </v-card>
      </div>
      <keep-alive><router-view :activeView="activeView" /></keep-alive>
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
    drawer: false,
    drawerWidth: 250,
    isLoading: false
  }),
  methods: {
    changeView () {
      if (this.activeView === 'detailView') {
        if (this.selectedSearchIndex > -1) {
          this.checkAndGo('singleSura')
        }
        this.$store.commit('setActiveView', 'textView')
        this.$store.commit('setScrollTrigger')
        return
      }
      if (this.selectedSearchIndex > -1) {
        this.checkAndGo('search')
      }
      this.$store.commit('setActiveView', 'detailView')
    },
    calculateWidth (showDetail) {
      if (!showDetail) {
        this.drawerWidth = 250
        return
      }
      this.drawerWidth = 440
    },
    async prepareData () {
      this.isLoading = true
      return new Promise((resolve) => {
        this.$store.dispatch('getQuranData')
        resolve()
      })
    },
    toggleDrawer (value) {
      this.$store.commit('setDrawerState', value)
    },
    checkAndGo (route) {
      if (this.$router.currentRoute.name !== route) {
        this.$router.push({ name: route })
      }
    }
  },
  computed: {
    drawerState () {
      return this.$store.getters.drawerState
    },
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    },
    activeView () {
      return this.$store.getters.activeView
    },
    selectedInput () {
      // use this to trigger reset
      if (!this.$store.getters.selectedInput) return null
      return this.$store.getters.selectedInput
    }
  },
  watch: {},
  updated () {},
  mounted () {},
  created () {
    this.drawer = this.drawerState
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
.compWrapper {
  padding-right: 19px;
  padding-left: 19px;
  margin-top: -48px;
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
.downArr {
  margin-top: 18px !important;
}
.viewSwitch {
  margin-right: 272px;
  width: 72px;
  margin-top: 22px;
  margin-bottom: -41px;
  cursor: pointer;
}
.activeView{
  background: #e8e8e8 !important;
  color: #0c1115 !important;
}
.switchLabel {
  margin: auto;
  width: fit-content;
  /* grey lighten-1*/
  color: #bdbdbd;
}
.v-data-footer {
  justify-content: end;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #a6a6a6;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #000;
}
.webKitWidth {
  width: -webkit-fill-available;
}
/************ Responseive***********/
@media (max-width: 600px) {
  .titleText {
    font-size: 15px;
    display: none;
  }
}
</style>
