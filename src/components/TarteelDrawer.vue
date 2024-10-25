<template>
  <v-navigation-drawer v-model="localDrawer" location="left" width="250">
    <v-toolbar dark>
      <v-toolbar-title>بحث</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="localDrawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list>
      <TarteelList
        :items="storedSearches"
        :selectedItem="selectedTarteelIndex"
        @selecteItem="handleSelectedSearch"
        @deleteItem="deleteTarteel"
      />
    </v-list>
    <v-toolbar dark>
      <v-toolbar-title>رتل</v-toolbar-title>
    </v-toolbar>
    <TarteelList
      :items="selectedRatls"
      :selectedItem="selectedRatlIndex"
      @selecteItem="handleSelectedRatl"
      @deleteItem="deleteRatl"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["update:drawer"])

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
  return selectedSearch.value?.results.map((mushtk) => {
    return {
      word: mushtk.word,
      count: mushtk.verses.length,
      coutingType: "verse-count",
    }
  })
})

const selectedRatlIndex = computed(() => tarteelStore?.getSelectedRatlIndex)

const handleSelectedSearch = (index) => {
  tarteelStore.setThisTarteel(index)
  if (router.currentRoute.value.name !== "tarteel") {
    router.push({ name: "tarteel" })
  }
  tarteelStore.setSelectedRatlIndex(0)
}

const handleSelectedRatl = (index) => {
  tarteelStore.setSelectedRatlIndex(index)
  tarteelStore.setSelectedRatl(selectedSearch.value.results[index])
}

const deleteTarteel = (index) => {
  tarteelStore.removeTarteelItem(index)
}

const deleteRatl = (index) => {
  tarteelStore.removeRatl(index)
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
</script>
