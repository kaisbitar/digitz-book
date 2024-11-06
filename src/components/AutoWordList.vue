<template>
  <v-list class="auto-word-list">
    <v-virtual-scroll
      :items="paginatedItems"
      :height="height"
      :item-height="48"
      @scroll="handleInfiniteScroll"
    >
      <template v-slot:default="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            v-bind="props"
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
            </template>

            <div class="d-flex align-center ml-8">
              <span class="text-body-1" style="width: 50px">{{
                item.verses.length
              }}</span>
              <v-badge
                :content="`آية`"
                floating
                offset-x="9"
                offset-y="6"
                color="verse-count"
              ></v-badge>
            </div>
            <template v-slot:append>
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
import { defineProps, defineEmits, toRef } from "vue"
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

const { paginatedItems, handleInfiniteScroll, isLoading } = useSimplePagination(
  toRef(props, "items")
)

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
</style>
