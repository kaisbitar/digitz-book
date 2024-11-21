<template>
  <v-list-item
    v-for="(item, index) in items"
    :key="index"
    :value="index"
    :color="selectedRatlIndex === index ? 'primary' : 'grey'"
    :class="{
      'active-tarteel-item': selectedRatlIndex === index,
    }"
    @click="handleSelectedRatl(index)"
  >
    <template v-slot:prepend>
      <v-list-item-title>
        <v-icon
          icon="mdi-file-outline"
          :color="selectedRatlIndex === index ? 'primary' : 'grey'"
          size="20"
          class="mx-2 count-key-item"
        />
        {{ item.word }}
        <span class="text-caption text-grey"> (</span>{{ item.count || 0 }}
        <span class="text-caption text-grey">آية) </span>
      </v-list-item-title>
    </template>

    <template v-slot:append>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="x-small"
        @click.stop="deleteRatl(index)"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useStore } from "@/stores/appStore"
import { useDisplay } from "vuetify"

const props = defineProps({
  items: {
    type: Array,
    required: false,
  },
  badgeContent: {
    type: String,
    required: false,
  },
})

const router = useRouter()
const display = useDisplay()
const store = useStore()
const tarteelStore = useTarteelStore()

const isMobile = computed(() => display.mobile.value)
const selectedRatlIndex = computed(() => tarteelStore.getSelectedRatlIndex)

const handleSelectedRatl = async (index) => {
  navigateToTarteel()
  await nextTick()
  router.push({ name: "tarteel", query: { view: "list" } })

  if (isMobile.value) {
    store.setTarteelDrawer(false)
  }

  if (selectedRatlIndex.value === index) {
    router.push({ name: "tarteel", query: { view: "detail" } })
  }
  updateSelectedRatl(index)
}

const navigateToTarteel = () => {
  if (router.currentRoute.value.name !== "tarteel") {
    router.push({ name: "tarteel" })
  }
}

const updateSelectedRatl = (index) => {
  tarteelStore.setSelectedRatlIndex(index)
  const selectedSearch = tarteelStore.getStoredTarteels.find(
    (tarteel) => tarteel.id === tarteelStore.getSelectedTarteelId
  )
  tarteelStore.setSelectedRatl(selectedSearch.results[index])
  store.setTarget(selectedSearch.results[index].verses[0])
}

const deleteRatl = (index) => {
  tarteelStore.removeRatl(index)
  updateSelectedRatl(index)
}

defineEmits(["selecteItem", "deleteItem"])
</script>
<style scoped>
.v-list-item-title {
  font-size: 14px;
}
</style>
