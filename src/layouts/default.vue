<template>
  <v-app>
    <v-main>
      <AppHeader />
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right>
        <tableQuranIndex
          @showDetailToggle="isShowDetail = !isShowDetail"
          :showDetail="isShowDetail"
        />
      </v-navigation-drawer>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const store = useQuranStore()
const isShowDetail = ref(false)
const drawerWidth = computed(() => (isShowDetail.value ? 490 : 290))

const drawer = computed({
  get: () => store.getDrawerState,
  set: value => store.setDrawerState(value),
})

onMounted(() => {})
</script>

<style lang="scss">
@import '@/styles/styles.scss';

.v-application {
  // font-family: $body-font-family !important;
  font-family: system-ui !important;
}

.activeView {
  // color: rgb(var(--v-theme-background-secondary)) !important;
}

.v-navigation-drawer__content {
  margin-top: 13px;
}

.topHeader {
  z-index: 6;
}
.v-data-table-header__content {
  display: flex;
  align-items: center;
  padding-bottom: 9px;
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
