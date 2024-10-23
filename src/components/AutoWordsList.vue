<template>
  <v-sheet class="d-flex flex-column" height="100%">
    <v-list class="flex-grow-1 overflow-y-auto">
      <v-virtual-scroll :items="items" height="300" item-height="50">
        <template v-slot:default="{ item }">
          <AutoWordItem
            :item="item"
            :checked="isItemChecked(item)"
            @add-item="emitAddItem"
            @remove-item="removeItem"
            @update:checked="toggleItemCheck(item)"
          />
        </template>
      </v-virtual-scroll>
    </v-list>
    <v-sheet class="pa-4">
      <v-btn @click="emitAddAll" color="primary" variant="tonal">
        رتل الجميع
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue"

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  checkedItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  "update:items",
  "update:checkedItems",
  "tarteelAll",
  "add-item",
  "remove-item",
])

const isItemChecked = (item) =>
  props.checkedItems.some((checkedItem) => checkedItem.word === item.word)

const emitAddItem = (item) => {
  emit("add-item", item)
}

const removeItem = (itemToRemove) => {
  const updatedItems = props.items.filter((item) => item !== itemToRemove)
  emit("update:items", updatedItems)
  emit("remove-item", itemToRemove)
  const updatedCheckedItems = props.checkedItems.filter(
    (item) => item !== itemToRemove
  )
  emit("update:checkedItems", updatedCheckedItems)
}

const emitAddAll = () => {
  emit("tarteelAll", props.checkedItems)
}

const toggleItemCheck = (item) => {
  const newCheckedItems = [...props.checkedItems]
  const index = newCheckedItems.findIndex(
    (checkedItem) => checkedItem.word === item.word
  )
  if (index === -1) {
    newCheckedItems.push(item)
  } else {
    newCheckedItems.splice(index, 1)
  }
  emit("update:checkedItems", newCheckedItems)
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgb(var(--v-theme-background));
}
</style>
