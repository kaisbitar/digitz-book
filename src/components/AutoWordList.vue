<template>
  <v-list class="flex-grow-1 overflow-y-auto">
    <v-virtual-scroll :items="items" :height="height" :item-height="itemHeight">
      <template v-slot:default="{ item }">
        <v-list-item
          :active="isItemChecked(item)"
          @click="toggleItemCheck(item)"
        >
          <template v-slot:prepend>
            <v-checkbox
              :model-value="isItemChecked(item)"
              @update:model-value="toggleItemCheck(item)"
              hide-details
              @click.stop
            ></v-checkbox>
          </template>
          <v-list-item-title>
            {{ item.word }}
          </v-list-item-title>
          <template v-slot:append>
            <v-badge
              :content="item.count"
              floating
              offset-x="50"
              offset-y="-1"
              color="word-count"
            ></v-badge>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-list>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  checkedItems: {
    type: Array,
    default: () => [],
  },
  height: {
    type: [Number, String],
    default: 300,
  },
  itemHeight: {
    type: [Number, String],
    default: 50,
  },
})

const emit = defineEmits(["update:checkedItems", "add-item", "remove-item"])

const isItemChecked = (item) =>
  props.checkedItems.some((checkedItem) => checkedItem.word === item.word)

const toggleItemCheck = (item) => {
  const newCheckedItems = isItemChecked(item)
    ? props.checkedItems.filter((checkedItem) => checkedItem.word !== item.word)
    : [...props.checkedItems, item]
  emit("update:checkedItems", newCheckedItems)

  if (isItemChecked(item)) {
    emit("remove-item", item)
  } else {
    emit("add-item", item)
  }
}
</script>
