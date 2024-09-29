<template>
  <v-app>
    <v-main>
      <AppHeader v-if="activeRoute !== 'home'" />
      <v-hover v-slot="{ isHovering, props }"
        ><v-navigation-drawer
          v-bind="props"
          v-model="drawer"
          :width="isHovering ? 600 : 310"
          :scrim="false"
          right
        >
          <TableQuranIndex></TableQuranIndex> </v-navigation-drawer
      ></v-hover>
      <v-container class="pb-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)

const drawer = computed({
  get: () => store.getDrawerState,
  set: (value) => store.setDrawerState(value),
})

const handleLanding = () => {
  if (activeRoute.value === "sura") {
    drawer.value = true
    return
  }
  if (activeRoute.value === "search") {
    drawer.value = false
  }
}

watch(activeRoute, () => {
  handleLanding()
})

onMounted(() => {
  // handleLanding()
})
</script>

<style lang="scss">
@import "@/styles/styles.scss";

.v-data-table-header__content {
  display: flex;
  align-items: center;
  padding-bottom: 9px;
}
</style>
