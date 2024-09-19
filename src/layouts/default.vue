<template>
  <v-app>
    <v-main>
      <AppHeader />
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right>
        <tableQuranIndex @showDetailToggle="calculateWidth" />
      </v-navigation-drawer>
      <div class="mainWrap">
        <router-view class="mt-n4" :activeView="activeView" />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const store = useQuranStore()

const drawerWidth = ref(250)

const drawer = computed({
  get: () => store.getDrawerState,
  set: value => store.setDrawerState(value),
})
const activeView = computed(() => store.getActiveView)

const calculateWidth = showDetail => {
  drawerWidth.value = showDetail ? 440 : 250
}

onMounted(() => {})
</script>

<style lang="scss">
@import '@/styles/styles.scss';

.mainWrap {
  margin-top: 23px;
  padding-left: 17px;
  padding-right: 17px;
}

.v-application {
  font-family: $body-font-family !important;
}

.activeView {
  // color: rgb(var(--v-theme-background-secondary)) !important;
}

.topHeader {
  z-index: 6;
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
