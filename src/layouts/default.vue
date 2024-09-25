<template>
  <v-app>
    <v-main>
      <AppHeader />
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right>
        <v-icon
          :class="isShowDetail ? 'selected' : 'not-selected'"
          class=""
          variant="tonal"
          color="green"
          size="small"
          @click="isShowDetail = !isShowDetail"
        >
          mdi-details </v-icon
        ><TableQuranIndex
          @showDetailToggle="isShowDetail = !isShowDetail"
          :showDetail="isShowDetail"
        ></TableQuranIndex>
      </v-navigation-drawer>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer border></v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"

const store = useQuranStore()
const isShowDetail = ref(false)
const drawerWidth = computed(() => (isShowDetail.value ? 700 : 340))

const drawer = computed({
  get: () => store.getDrawerState,
  set: (value) => store.setDrawerState(value),
})

onMounted(() => {})
</script>

<style lang="scss">
@import "@/styles/styles.scss";

.v-data-table-header__content {
  display: flex;
  align-items: center;
  padding-bottom: 9px;
}
.v-navigation-drawer__content {
  height: auto;
  overflow: hidden !important;
}
</style>
