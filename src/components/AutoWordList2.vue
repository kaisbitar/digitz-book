<template>
  <div
    v-for="groupType in ['exact', 'attached', 'root', 'other']"
    :key="groupType"
    style="max-height: 200px !important; overflow-y: auto; max-width: 800px"
  >
    <div v-if="getGroupItems(groupType).length" class="px-2 py-2" elevation="4">
      <v-divider class="my-2" />

      <div
        class="position-sticky mb-2 text-grey-darken-1"
        style="top: 0; background: white; z-index: 1"
      >
        {{ getGroupTitle(groupType) }} ({{ getGroupItems(groupType).length }})
      </div>
      <div class="d-flex flex-wrap">
        <v-chip
          v-for="item in getGroupItems(groupType)"
          :key="item.word"
          :color="isItemChecked(item) ? 'primary' : 'grey-darken-2'"
          variant="tonal"
          size="large"
          class="ma-1"
          @click="toggleItemCheck(item)"
        >
          <span class="ml-1">{{ item.word }}</span>
          <span class="text-caption text-grey-darken-1"
            >({{ item.verses.length }})</span
          >
        </v-chip>
      </div>
    </div>
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
