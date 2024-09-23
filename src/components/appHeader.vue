<template>
  <v-app-bar class="" height="60" border flat>
    <template v-slot:prepend>
      <v-app-bar-title>الكتاب المرقوم</v-app-bar-title>
      <v-app-bar-nav-icon
        size="small"
        @click.stop="toggleDrawer"
      ></v-app-bar-nav-icon>
      <AppNavigation />
      <v-btn
        :class="activeRoute === 'search' ? 'selected' : 'not-selected'"
        prepend-icon="$vuetify"
        variant="tonal"
        color="green"
        @click="openSearchDialog()"
      >
        ابحث
      </v-btn>
      <AppDialog
        v-model="showAutoComplete"
        :componentToRender="AutoComplete"
        :componentsToRender="[
          {
            component: AutoComplete,
          },
        ]"
      />
    </template>
    <template v-slot:append>
      <AppDropMenu :components="[ThemeToggle]"> </AppDropMenu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import ThemeToggle from "./ThemeToggle.vue"
import AutoComplete from "./AutoComplete.vue"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)
const researchResults = computed(() => store.getResearchResults())

const showAutoComplete = ref(false)

const openSearchDialog = () => {
  showAutoComplete.value = true
  router.push("/search")
}

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState)
}

watch(researchResults, (newValue) => {
  console.log("researchResults changed:", newValue)

  showAutoComplete.value = false
})
</script>

<style scoped>
.v-toolbar-title {
  width: 163px;
}
.max-width-auto-complete {
  min-width: 611px;
  max-width: 911px;
  margin-left: auto;
  width: fit-content;
}
</style>
