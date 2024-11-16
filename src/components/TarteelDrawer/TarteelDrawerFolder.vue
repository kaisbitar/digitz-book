<template>
  <div :class="{ 'px-4': itemHasChildren }">
    <div v-for="item in tarteelTree">
      <div class="count-key-item position-absolute map-line" v-if="!root"></div>
      <v-list-item :key="item.id" @click="$emit('selectItem', item)">
        <v-list-item-title
          :class="selectedTarteelId === item.id ? 'active-folder' : ''"
        >
          <v-icon
            class="me-2 count-key-item"
            icon="mdi-database-search-outline"
            :color="selectedTarteelId === item.id ? 'primary' : 'grey'"
            size="20"
          />
          {{ item.inputText }}
          <span class="text-caption text-grey"> (</span
          >{{ item.results?.length || 0 }}
          <span class="text-caption text-grey">مشتق) </span>
        </v-list-item-title>

        <template v-slot:append>
          <v-icon
            size="x-small"
            icon="mdi-close"
            @click.stop="$emit('deleteItem', item)"
          />
        </template>
      </v-list-item>

      <tarteel-drawer-folder
        v-if="hasChildren(item)"
        :itemHasChildren="hasChildren(item)"
        :items="item.children"
        :root="false"
        @select-item="$emit('selectItem', $event)"
        @delete-item="$emit('deleteItem', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useTarteelStore } from "@/stores/tarteelStore"

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

defineEmits(["selectItem", "deleteItem"])

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
