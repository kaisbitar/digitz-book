<template>
  <v-list class="flex-grow-1 overflow-y-auto">
    <v-virtual-scroll :items="items" :height="height" :item-height="itemHeight">
      <template v-slot:default="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            color="primary"
            v-bind="props"
            :active="isItemChecked(item)"
            @click="toggleItemCheck(item)"
            class="py-1"
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
              <v-badge
                :content="item.count.toString()"
                floating
                offset-x="-19"
                offset-y="0"
                color="word-count"
              ></v-badge>
            </v-list-item-title>

            <template v-slot:append>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                class="ml-2"
                @click.stop="removeItem(item)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-hover>
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
  currentWordsList: {
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

const emit = defineEmits(["update:checkedItems", "update:currentWordsList"])

const isItemChecked = (item) =>
  props.checkedItems.some((checkedItem) => checkedItem.word === item.word)

const toggleItemCheck = (item) => {
  const newCheckedItems = isItemChecked(item)
    ? props.checkedItems.filter((checkedItem) => checkedItem.word !== item.word)
    : [...props.checkedItems, item]

  emit("update:checkedItems", newCheckedItems)
}

const removeItem = (item) => {
  const newFilteredWords = props.items.filter((word) => word.word !== item.word)

  emit("update:currentWordsList", newFilteredWords)

  if (isItemChecked(item)) {
    const newCheckedItems = props.checkedItems.filter(
      (checkedItem) => checkedItem.word !== item.word
    )
    emit("update:checkedItems", newCheckedItems)
  }
}
</script>

<style scoped></style>
