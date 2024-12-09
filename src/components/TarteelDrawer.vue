<template>
  <v-navigation-drawer
    :model-value="drawerState"
    @update:model-value="updateDrawerState"
    location="left"
    width="250"
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
        <TarteelList
          :items="storedSearches"
          :selectedItem="selectedTarteelIndex"
          @selecteItem="handleSelectedSearch"
          @deleteItem="deleteTarteel"
        />
      </v-card>
      <div class="ratls-container tarteelDrawerRef">
        <TarteelList
          v-if="selectedRatls?.length > 1"
          :items="selectedRatls"
          :selectedItem="selectedRatlIndex"
          @selecteItem="handleSelectedRatl"
          @deleteItem="deleteRatl"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useStore } from "@/stores/appStore"
import { useDisplay } from "vuetify"

const router = useRouter()
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
  tarteelStore.setSearchedTarteel(index)
  tarteelStore.setSelectedRatlIndex(0)
  tarteelStore.setSelectedRatl(selectedSearch.value.results[0])
  store.setTarget(selectedSearch.value.results[0].verses[0])
}

const updateSelectedRatl = (index) => {
  tarteelStore.setSelectedRatlIndex(index)
  tarteelStore.setSelectedRatl(selectedSearch.value.results[index])
  store.setTarget(selectedSearch.value.results[index].verses[0])
}

const handleSelectedSearch = (index) => {
  navigateToTarteel()
  if (selectedTarteelIndex.value !== index) {
    updateSelectedSearch(index)
    // scrollToTop()
  }
}

const isMobile = computed(() => {
  return display.mobile.value
})

const handleSelectedRatl = (index) => {
  navigateToTarteel()
  if (isMobile.value) {
    store.setTarteelDrawer(false)
  }
  if (selectedRatlIndex.value === index) return
  updateSelectedRatl(index)
}

const deleteTarteel = (index) => {
  tarteelStore.removeTarteelItem(index)
  handleSelectedSearch(index)
  // scrollToTop()
}

const deleteRatl = (index) => {
  tarteelStore.removeRatl(index)
  updateSelectedRatl(index)
}

const tarteelDrawerRef = ref(null)
const scrollToTop = async () => {
  // await nextTick()
  // if (!tarteelDrawerRef.value) return
  // tarteelDrawerRef.value.scrollTop = 0
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
