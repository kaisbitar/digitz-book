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

        <TarteelDrawerFolder :items="storedTarteels" />
      </v-card>

      <div class="ratls-container tarteelDrawerRef">
        <TarteelDrawerFile :items="selectedRatls" />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { useTarteelStore } from "@/stores/tarteelStore"
import { useStore } from "@/stores/appStore"
import { sassFalse } from "sass"

const store = useStore()

const tarteelStore = useTarteelStore()

const storedTarteels = computed(() => {
  return tarteelStore?.getStoredTarteels
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
