<template>
  <v-app>
    <v-main>
      <AppHeader />
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right>
        <tableQuranIndex @showDetailToggle="calculateWidth" />
      </v-navigation-drawer>

      <div class="mainWrap">
        <autoComplete />
        <div class="viewSwitch">
          <v-card :class="{ activeView: activeView === 'detailView' }" class="switchLabel" outlined>
            <div
              @click="changeView"
              class="pl-2 pr-2 pt-1 d-flex align-center"
              style="font-size: 12px"
            >
              detailView
              <v-icon size="small" class="mr-1 pb-1">mdi-table</v-icon>
            </div>
          </v-card>
        </div>
        <router-view :activeView="activeView" />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const store = useQuranStore()
const router = useRouter()

const drawerWidth = ref(250)

const drawer = computed(() => store.getDrawerState)
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const activeView = computed(() => store.getActiveView)

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

const toggleDrawer = value => {
  store.setDrawerState(value)
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}

onMounted(() => {})
</script>

<style lang="scss">
@import '@/styles/styles.scss';

.mainWrap {
  padding-left: 17px;
  padding-right: 17px;
}

.v-application {
  font-family: $body-font-family !important;
}

.viewSwitch {
  margin-right: 272px;
  width: 72px;
  margin-top: 22px;
  margin-bottom: -41px;
  cursor: pointer;
}

.activeView {
  // color: rgb(var(--v-theme-background-secondary)) !important;
}

.switchLabel {
  margin: auto;
  width: fit-content;
}
.topHeader {
  z-index: 6;
}

.compWrapper {
  // padding-right: 19px;
  // padding-left: 19px;
  // margin-top: -48px;
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
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}
.webKitWidth {
  width: -webkit-fill-available;
}
.v-application__wrap {
  min-height: auto;
  overflow: hidden;
}
/* Responsive styles */
</style>
