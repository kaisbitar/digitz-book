<template>
  <v-navigation-drawer v-model="localDrawer" location="left" width="250">
    <v-toolbar dark>
      <v-toolbar-title>تراتيل</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="localDrawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list>
      <v-list-item
        v-for="(item, index) in storedTarteels"
        :key="index"
        :value="index"
        color="grey"
        :active="selectedTarteel === index"
        @click="handleSelectedTarteel(index)"
      >
        <template v-slot:prepend>
          <v-list-item-title>
            {{ item.inputText }}
          </v-list-item-title>
        </template>
        <template v-slot:append>
          <v-badge
            :content="`${item?.results?.length} مشتق`"
            color="word-count"
            offset-x="5"
            offset-y="0"
            inline
          ></v-badge>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click.stop="deleteTarteel(index)"
          ></v-btn>
        </template>
      </v-list-item>
      <v-divider horizontal></v-divider>
    </v-list>
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

const localDrawer = ref(true)
const selectedTarteel = computed(() => tarteelStore.getSelectedTarteelIndex)

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

const handleSelectedTarteel = (index) => {
  tarteelStore.setThisTarteel(index)
  if (router.currentRoute.value.name !== "tarteel") {
    router.push({ name: "tarteel" })
  }
}

const deleteTarteel = (index) => {
  tarteelStore.removeTarteelItem(index)
}
</script>
