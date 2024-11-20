<template>
  <v-tabs
    v-model="tab"
    direction="horizontal"
    @update:modelValue="handleTabChange"
    show-arrows
    bg-color="surface"
  >
    <v-tab
      v-for="item in storedTarteels"
      :key="item.id"
      min-width="120"
      class="px-2"
    >
      <v-icon
        class="me-1 count-key-item"
        icon="mdi-database-search-outline"
        :color="selectedTarteelId === item.id ? 'primary' : 'grey'"
        size="20"
      />
      <span class="font-weight-bold">{{ item.inputText + "ـ" }}</span>

      <template #append>
        <v-btn
          class="float-left"
          hover
          variant="plain"
          icon="mdi-close"
          size="small"
          v-show="item.id === selectedTarteelId"
          @click.stop="handleDeleteItem(item)"
        />
      </template>
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useRouter } from "vue-router"

const router = useRouter()
const tarteelStore = useTarteelStore()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  itemHasChildren: {
    type: Boolean,
    default: false,
  },
  root: {
    type: Boolean,
    default: true,
  },
})

const storedTarteels = computed(() => tarteelStore.getStoredTarteels)
const tab = ref(0)

const handleSelectItem = (item) => {
  tarteelStore.setSelectedTarteelId(item.id)
  router.push({ name: "tarteel", query: { view: "overview" } })
}

const handleDeleteItem = (item) => {
  tarteelStore.removeTarteelItem(item.id)
}

const handleTabChange = (newTab) => {
  handleSelectItem(storedTarteels.value[newTab])
}

const selectedTarteelId = computed(() => tarteelStore.getSelectedTarteelId)

onMounted(() => {
  tab.value = 1
})
</script>
