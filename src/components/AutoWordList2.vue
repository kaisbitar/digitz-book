<template>
  <div class="px-2">
    <template
      v-for="groupType in ['exact', 'attached', 'root', 'other']"
      :key="groupType"
    >
      <v-sheet
        v-if="getGroupItems(groupType).length"
        class="mb-4"
        elevation="0"
      >
        <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">
          {{ getGroupTitle(groupType) }} ({{ getGroupItems(groupType).length }})
        </div>
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="item in getGroupItems(groupType)"
            :key="item.word"
            :color="isItemChecked(item) ? 'primary' : undefined"
            variant="outlined"
            size="small"
            class="ma-1"
            @click="toggleItemCheck(item)"
          >
            <span class="ml-1">{{ item.word }}</span>
            <span class="text-caption text-grey-darken-1"
              >({{ item.verses.length }})</span
            >
          </v-chip>
        </div>
      </v-sheet>
    </template>
  </div>
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

const getGroupItems = (groupType) => {
  return props.items.filter((item) => item.group === groupType)
}
</script>
