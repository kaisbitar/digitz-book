<template>
  <v-navigation-drawer
    :model-value="drawerState"
    @update:model-value="updateDrawerState"
    location="left"
    width="270"
  >
    <div class="d-flex flex-column fill-height">
      <v-card elevation="2" class="mb-1">
        <v-toolbar>
          <v-toolbar-title>ترتيل</v-toolbar-title>
          <AppToggleBtn
            isActive
            activeIcon="mdi-menu-open"
            size="default"
            @toggle="handleClose"
          />
        </v-toolbar>
        <TarteelDrawerFolder
          :items="storedSearches"
          :selectedItem="selectedTarteelIndex"
          :itemIcon="'mdi-database-search-outline'"
          @selecteItem="handleSelectedSearch"
          @deleteItem="deleteTarteel"
        />
      </v-card>
      <div class="ratls-container tarteelDrawerRef">
        <TarteelDrawerList
          :items="selectedRatls"
          :selectedItem="selectedRatlIndex"
          :itemIcon="'mdi-file-outline'"
          @selecteItem="handleSelectedRatl"
          @deleteItem="deleteRatl"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useStore } from "@/stores/appStore"
import { useDisplay } from "vuetify"

const router = useRouter()
const route = useRoute()
const display = useDisplay()
const store = useStore()

const tarteelStore = useTarteelStore()

const storedTarteels = computed(() => {
  return tarteelStore?.getStoredTarteels
})

const storedSearches = computed(() => {
  return storedTarteels?.value.map((tarteel) => {
    return {
      word: tarteel.inputText,
      count: tarteel.results.length,
      coutingType: "word-count",
    }
  })
})

const selectedTarteelIndex = computed(
  () => tarteelStore?.getSelectedTarteelIndex
)

const selectedSearch = computed(
  () => storedTarteels?.value[selectedTarteelIndex.value]
)

const selectedRatls = computed(() => {
  return selectedSearch.value?.results.map((rtl) => {
    return {
      word: rtl.word,
      count: rtl.verses.length,
      coutingType: "verse-count",
    }
  })
})

const selectedRatlIndex = computed(() => tarteelStore?.getSelectedRatlIndex)

const navigateToTarteel = () => {
  if (router.currentRoute.value.name !== "tarteel") {
    router.push({ name: "tarteel" })
  }
}

const updateSelectedSearch = (index) => {
  if (storedSearches.value.length === 0) return
  tarteelStore.setSelectedTarteelIndex(index)
  store.setTarget(selectedSearch.value.results[0].verses[0])
  updateSelectedRatl(0)
}

const updateSelectedRatl = (index) => {
  tarteelStore.setSelectedRatlIndex(index)
  tarteelStore.setSelectedRatl(selectedSearch.value.results[index])
  store.setTarget(selectedSearch.value.results[index].verses[0])
}

const handleSelectedSearch = (index) => {
  navigateToTarteel()
  if (selectedTarteelIndex.value === index) return
  updateSelectedSearch(index)
}

const isMobile = computed(() => {
  return display.mobile.value
})

const handleSelectedRatl = async (index) => {
  navigateToTarteel()
  await nextTick()
  router.push({ name: "tarteel", query: { view: "overview" } })

  if (isMobile.value) {
    store.setTarteelDrawer(false)
  }
  if (selectedRatlIndex.value === index) return
  updateSelectedRatl(index)
}

const deleteTarteel = (index) => {
  tarteelStore.removeTarteelItem(index)
  handleSelectedSearch(index)
}

const deleteRatl = (index) => {
  tarteelStore.removeRatl(index)
  updateSelectedRatl(index)
}

const handleClose = async () => {
  await nextTick()
  store.setTarteelDrawer(false)
}

const drawerState = computed(() => store.getTarteelDrawer)

const updateDrawerState = (value) => {
  store.setTarteelDrawer(value)
}

onMounted(() => {})
</script>

<style scoped>
.ratls-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Important for Firefox */
}
</style>
