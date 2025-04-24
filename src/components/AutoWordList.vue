<template>
  <v-list class="auto-word-list">
    <v-virtual-scroll
      :items="paginatedItems"
      :height="height"
      :item-height="48"
      @scroll="handleInfiniteScroll"
    >
      <template v-slot:default="{ item }">
        <v-list-item
          :active="isItemChecked(item)"
          @click="toggleItemCheck(item)"
          class="py-1"
        >
          <template v-slot:prepend>
            <div class="d-flex align-center" style="width: 57px">
              <v-checkbox
                :model-value="isItemChecked(item)"
                @update:model-value="toggleItemCheck(item)"
                hide-details
                @click.stop
              ></v-checkbox>
            </div>
            <v-list-item-title class="text-right" style="width: 100px">
              {{ item.word }}
            </v-list-item-title>
            <span style="width: 100px">({{ item.verses.length }} آية)</span>
          </template>

          <template v-slot:append>
            <v-chip
              size="x-small"
              :color="item.group === 'exact' ? 'primary' : undefined"
              variant="outlined"
              class="mr-2"
            >
              {{ getGroupTitle(item.group) }}
            </v-chip>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              class="ml-2"
              @click.stop="removeItem(item)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-list>
</template>

<script setup>
import { defineProps, defineEmits, toRef, computed } from "vue"
import { useSimplePagination } from "@/hooks/useSimplePagination"

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
    default: 490,
  },
})

const itemsRef = toRef(props, "items")
const { paginatedItems, handleInfiniteScroll } = useSimplePagination(itemsRef)

const getGroupTitle = (group) => {
  const titles = {
    exact: "مطابقة تامة",
    root: "الجذر والمشتقات",
    attached: "صيغ متصلة",
    other: "تشابه صوتي",
  }
  return titles[group] || group
}

const emit = defineEmits([
  "update:checkedItems",
  "update:currentWordsList",
  "submitTarteel",
])

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
  padding-top: 0 !important;
  max-height: 500px;
}

.group-summary {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}
</style>
