<template>
  <v-navigation-drawer v-model="localDrawer" location="left" width="250">
    <v-toolbar dark>
      <v-toolbar-title>ترتيل</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="localDrawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card elevation="10" class="mb-1">
      <TarteelList
        :items="storedSearches"
        :selectedItem="selectedTarteelIndex"
        @selecteItem="handleSelectedSearch"
        @deleteItem="deleteTarteel"
      />
    </v-card>
    <div
      class="overflow-y-auto tarteel-drawer-container"
      ref="tarteelDrawerRef"
      :style="{ height: `${dynamicHeight}px` }"
    >
      <TarteelList
        :items="selectedRatls"
        :selectedItem="selectedRatlIndex"
        @selecteItem="handleSelectedRatl"
        @deleteItem="deleteRatl"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useStore } from "@/stores/appStore"

const router = useRouter()
const store = useStore()

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["update:drawer"])

const scrollToTop = () => {
  if (tarteelDrawerRef.value) {
    tarteelDrawerRef.value.scrollTop = 0
  }
}

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
    scrollToTop()
  }
}

const handleSelectedRatl = (index) => {
  navigateToTarteel()
  if (selectedRatlIndex.value === index) return
  updateSelectedRatl(index)
}

const deleteTarteel = (index) => {
  tarteelStore.removeTarteelItem(index)
  handleSelectedSearch(index)
  scrollToTop()
}

const deleteRatl = (index) => {
  tarteelStore.removeRatl(index)
  updateSelectedRatl(index)
}

const localDrawer = ref(true)

watch(
  () => props.drawer,
  (newValue) => {
    localDrawer.value = newValue
  }
)

watch(localDrawer, (newValue) => {
  emit("update:drawer", newValue)
})

watch(router.currentRoute, () => {
  if (router.currentRoute.value.name === "tarteel") {
    localDrawer.value = true
  }
})

const tarteelDrawerRef = ref(null)
const { setContainerHeight, dynamicHeight, scrollToActiveItem } =
  useWindow(tarteelDrawerRef)
useResizeHandler({
  elementRef: tarteelDrawerRef,
  elementFunc: setContainerHeight,
})

onMounted(async () => {
  scrollToActiveItem(".active-tarteel-item", ".tarteel-drawer-container")
  await nextTick()
  setContainerHeight()
})
</script>
