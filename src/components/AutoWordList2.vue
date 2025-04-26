<template>
  <div
    v-for="groupType in ['exact', 'attached', 'root', 'other']"
    :key="groupType"
  >
    <v-card
      v-if="getGroupItems(groupType).length"
      variant="outlined"
      class="mb-2"
    >
      <v-card-title
        class="position-sticky mb-2 text-grey-darken-1"
        style="top: 0; background: white; z-index: 1; font-size: 1rem"
      >
        {{ getGroupTitle(groupType) }} ({{ getGroupItems(groupType).length }})
      </v-card-title>
      <v-card-text
        style="max-height: 100px !important; overflow-y: auto; max-width: 800px"
      >
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
      </v-card-text>
    </v-card>
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
