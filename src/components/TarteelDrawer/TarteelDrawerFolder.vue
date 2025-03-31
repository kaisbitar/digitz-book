<template>
  <div :class="{ 'px-2': itemHasChildren }">
    <div v-for="item in tarteelTree">
      <div class="count-key-item position-absolute map-line" v-if="!root"></div>
      <v-list-item :key="item.id" @click="handleSelectItem(item)">
        <v-list-item-title
          :class="selectedTarteelId === item.id ? 'active-folder' : ''"
        >
          <v-icon
            class="me-1 count-key-item"
            icon="mdi-database-search-outline"
            :color="selectedTarteelId === item.id ? 'primary' : 'grey'"
            size="20"
          />
          <span class="font-weight-bold">{{ item.inputText + "ـ" }}</span>

          <span class="text-caption text-grey mr-1"> (</span
          >{{ item.results?.length || 0 }}
          <span class="text-caption text-grey">مشتق) </span>
        </v-list-item-title>

        <template v-slot:append>
          <v-icon
            size="x-small"
            icon="mdi-close"
            @click.stop="handleDeleteItem(item)"
          />
        </template>
      </v-list-item>

      <TarteelDrawerFolder
        v-if="hasChildren(item)"
        :itemHasChildren="hasChildren(item)"
        :items="item.children"
        :root="false"
        @select-item="handleSelectItem"
        @delete-item="handleDeleteItem"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
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

const handleSelectItem = (item) => {
  tarteelStore.setSelectedTarteelId(item.id)
  router.push({ name: "tarteel", query: { view: "overview" } })
}

const handleDeleteItem = (item) => {
  tarteelStore.removeTarteelItem(item.id)
}
const tarteelTree = computed(() => {
  // Use items prop if provided (for nested levels), otherwise use store tree
  return props.items?.length ? props.items : tarteelStore.getTarteelTree
})
const selectedTarteelId = computed(() => tarteelStore.getSelectedTarteelId)

const hasChildren = (item) => {
  return item.children && item.children.length > 0
}

defineOptions({ inheritAttrs: false })
</script>

<style scoped>
.map-line {
  height: 19px;
  border-right: 0.1px solid #878787;
  margin-top: 0px;
  margin-right: 9px;
  width: 7px;
  border-bottom: 0.1px solid #878787;
}
.v-list-item-title {
  font-size: 14px;
}
.active-folder {
  background-color: rgb(var(--v-theme-active-row));
}
</style>
