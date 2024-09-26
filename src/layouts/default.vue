<template>
  <v-app>
    <v-main>
      <AppHeader v-if="activeRoute !== 'home'" />
      <v-navigation-drawer :width="drawerWidth" v-model="drawer" app right>
        <v-icon
          :class="drawer ? 'selected' : 'not-selected'"
          class=""
          variant="tonal"
          color="green"
          size="small"
          @click="drawer = !drawer"
        >
          mdi-details </v-icon
        ><TableQuranIndex
          @showDetailToggle="drawer = !drawer"
          :showDetail="drawer"
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
const router = useRouter()

const isShowSuraDetail = ref(false)
const drawerWidth = computed(() => (drawer.value ? 600 : 310))
const activeRoute = computed(() => router.currentRoute.value.name)

const drawer = computed({
  get: () => store.getDrawerState,
  set: (value) => store.setDrawerState(value),
})

const handleLanding = () => {
  console.log(activeRoute)
  if (activeRoute.value !== "sura") {
    drawer.value = false
    return
  }
  drawer.value = true
}

watch(activeRoute, () => {
  handleLanding()
})

onMounted(() => {
  handleLanding()
})
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
