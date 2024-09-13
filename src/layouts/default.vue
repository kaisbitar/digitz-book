<template>
  <v-app>
    <v-main>
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right class="grey lighten-4">
        <tableQuranIndex @showDetailToggle="calculateWidth" />
      </v-navigation-drawer>
      <v-app-bar class="topHeader brown lighten-5" flat app :height="71">
        <v-app-bar-nav-icon @click.stop=";(drawer = !drawer), toggleDrawer(drawer)">
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
      <div class="mainWrap">
        <div class="viewSwitch">
          <v-card :class="{ activeView: activeView === 'detailView' }" class="switchLabel" outlined>
            <div @click="changeView" class="pl-2 pr-2" style="font-size: 12px">detailView</div>
          </v-card>
        </div>
      </div>

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import autoComplete from '@/components/autoComplete.vue'
import tableQuranIndex from '@/components/tableQuranIndex.vue'

const store = useQuranStore()
const router = useRouter()

const drawer = ref(false)
const drawerWidth = ref(250)
const isLoading = ref(false)

const drawerState = computed(() => store.getDrawerState)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const activeView = computed(() => store.getActiveView)
const selectedInput = computed(() => {
  if (!store.getSelectedInput) return null
  return store.getSelectedInput
})

const changeView = () => {
  const isDetailView = activeView.value === 'detailView'
  const hasSelectedSearch = selectedSearchIndex.value > -1

  if (isDetailView) {
    if (hasSelectedSearch) {
      checkAndGo('singleSura')
    }
    store.setActiveView('textView')
    store.setScrollTrigger()
    return
  }

  if (hasSelectedSearch) {
    checkAndGo('search')
  }
  store.setActiveView('detailView')
}

const calculateWidth = showDetail => {
  drawerWidth.value = showDetail ? 440 : 250
}

const prepareData = async () => {
  isLoading.value = true
  await store.getQuranData()
  isLoading.value = false
}

const toggleDrawer = value => {
  store.setDrawerState(value)
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}

onMounted(() => {
  drawer.value = drawerState.value
  prepareData()
})
</script>
<style lang="scss">
@import '@/styles/styles.scss';
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
.activeView {
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
