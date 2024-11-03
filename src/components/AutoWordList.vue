<template>
  <v-list class="flex-grow-1 auto-word-list">
    <v-virtual-scroll :items="items" :height="height" :item-height="itemHeight">
      <template v-slot:default="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            max-width="300"
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
              <!-- <v-badge
                :content="`${item.count} مرة`"
                floating
                offset-x="-80"
                offset-y="0"
                color="default-count"
              ></v-badge> -->
            </v-list-item-title>

            <template v-slot:append>
              <span class="ml-10">{{ item.verses.length }}</span>
              <v-badge
                :content="`آية`"
                floating
                offset-x="30"
                offset-y="6"
                color="verse-count"
              ></v-badge>
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
  <!-- <AppTarteelBtn
    :checked-items="checkedItems"
    :is-disabled="items.length === 0"
  /> -->
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
    default: 490,
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

<style scoped>
.auto-word-list {
  z-index: 1;
  opacity: 0.7;
}
</style>
