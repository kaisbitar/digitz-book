<template>
  <v-sheet class="d-flex flex-column" height="100%">
    <v-list class="flex-grow-1 overflow-y-auto">
      <v-virtual-scroll :items="items" height="300" item-height="50">
        <template v-slot:default="{ item }">
          <AutoFilteredWordItem
            :item="item"
            @add-item="emitAddItem"
            @remove-item="removeItem"
          />
        </template>
      </v-virtual-scroll>
    </v-list>
    <v-sheet class="pa-4">
      <v-btn @click="searchAllFilteredWords" color="primary" variant="tonal">
        رتل الجميع
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  totalCount: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits([
  "update:items",
  "tarteelAll",
  "add-item",
  "remove-item",
])

const emitAddItem = (item) => {
  emit("add-item", item)
}

const removeItem = (index) => {
  const updatedItems = [...props.items]
  const removedItem = updatedItems.splice(index, 1)[0]
  emit("update:items", updatedItems)
  emit("remove-item", removedItem) // Emit the removed item
}

const searchAllFilteredWords = () => {
  emit("tarteelAll", props.items)
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
