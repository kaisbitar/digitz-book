<template>
  <v-list class="auto-word-list opacity-70">
    <v-virtual-scroll :items="items" :item-height="48">
      <template v-slot:default="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
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
              <span class="ml-15" :style="{ width: '5px' }">{{
                item.verses.length
              }}</span>
              <v-badge
                :content="`آية`"
                floating
                offset-x="30"
                offset-y="6"
                color="verse-count"
              ></v-badge>
            </template>
            <v-list-item-title>
              {{ item.word }}
            </v-list-item-title>

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

    <div class="list-append">
      <AppTarteelBtn
        :checked-items="checkedItems"
        :is-disabled="items.length === 0"
        @submit="emit('submitTarteel')"
      />
    </div>
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
    default: 490,
  },
})

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
  z-index: 1;
  padding-top: 0 !important;
  /* width: 300px; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.v-virtual-scroll) {
  flex: 1;
  height: auto !important;
}

.list-append {
  padding: 0px 16px;
}
</style>
