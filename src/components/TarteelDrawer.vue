<template>
  <v-navigation-drawer v-model="localDrawer" location="left" width="250">
    <v-toolbar dark>
      <v-toolbar-title>تراتيل</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="localDrawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expansion-panels>
      <TarteelDrawerItem
        v-for="(item, index) in storedTarteels"
        :key="index"
        :item="item"
        :index="index"
        @update:selection="updateSelectedTarteel"
      />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useTarteelStore } from "@/stores/tarteelStore"
import TarteelDrawerItem from "./TarteelDrawerItem.vue"

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["update:drawer"])

const tarteelStore = useTarteelStore()

const localDrawer = ref(true)
const selectedTarteel = ref(null)

watch(
  () => props.drawer,
  (newValue) => {
    localDrawer.value = newValue
  }
)

watch(localDrawer, (newValue) => {
  emit("update:drawer", newValue)
})

const storedTarteels = computed(() => {
  return tarteelStore.getStoredTarteels
})

const updateSelectedTarteel = (index) => {
  tarteelStore.setSelectedTarteelIndex(index)
}
</script>
