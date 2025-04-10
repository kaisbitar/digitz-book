<template>
  <v-tabs
    v-model="tab"
    direction="horizontal"
    show-arrows
    bg-color="surface"
    class="vscode-style-tabs"
    hide-slider
  >
    <v-tab
      v-for="item in storedTarteels"
      :key="item.id"
      min-width="120"
      class="px-2"
    >
      <template #prepend>
        <v-icon
          class="mx-2 count-key-item"
          icon="mdi-database-search-outline"
          :color="selectedTarteelId === item.id ? 'primary' : 'grey'"
          size="20"
        />
      </template>
      <span class="font-weight-bold">{{ item.inputText + "ـ" }}</span>

      <template #append>
        <v-btn
          class="float-left"
          hover
          variant="text"
          icon="mdi-close"
          size="small"
          :style="{
            visibility: item.id === selectedTarteelId ? 'visible' : 'hidden',
          }"
          @click.stop="handleDeleteItem(item)"
        />
      </template>
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useTarteelStore } from "@/stores/TarteelStore"
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
const selectedTarteelId = computed(() => tarteelStore.getSelectedTarteelId)

const tab = computed({
  get: () =>
    storedTarteels.value.findIndex(
      (item) => item.id === selectedTarteelId.value
    ),
  set: (newTab) => {
    tarteelStore.setSelectedTarteelId(storedTarteels.value[newTab].id)
    router.push({ name: "tarteel", query: { view: "list" } })
  },
})

const handleDeleteItem = (item) => {
  tarteelStore.removeTarteelItem(item.id)
}

onMounted(() => {
  // tab.value = 1
})
</script>

<style>
.vscode-style-tabs .v-slide-group__content {
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}
.vscode-style-tabs {
  .v-tab {
    border-left: 1px solid rgba(128, 128, 128, 0.2);
  }

  .v-tab--selected {
    background: rgb(var(--v-theme-background)) !important;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: rgb(var(--v-theme-primary));
    }
  }
}
</style>
