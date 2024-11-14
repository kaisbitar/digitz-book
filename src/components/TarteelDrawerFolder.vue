<template>
  <v-list-item
    v-for="(item, index) in items"
    :key="index"
    :value="index"
    color="grey"
    :class="{
      'active-tarteel-item': selectedItem === index,
    }"
    @click="$emit('selecteItem', index)"
  >
    <template v-slot:prepend>
      <v-list-item-title>
        <v-icon :icon="itemIcon" size="20" class="me-2 count-key-item" />
        {{ item.word }}
      </v-list-item-title>
      <!-- <span class="text-caption ms-2"> {{ item.count }} آية </span> -->
    </template>

    <template v-slot:append>
      <v-badge
        :content="item.count"
        :color="item.coutingType"
        class="word-count"
        offset-x="5"
        offset-y="0"
        inline
      ></v-badge>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="x-small"
        @click.stop="$emit('deleteItem', index)"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: false,
  },
  selectedItem: {
    type: Number,
    required: false,
  },
  badgeContent: {
    type: String,
    required: false,
  },
  itemIcon: {
    type: String,
    required: false,
  },
})

defineEmits(["selecteItem", "deleteItem"])

const getCoutingTypeLabel = (coutingType) => {
  if (coutingType === "word-count") {
    return "مشتق"
  }
  if (coutingType === "verse-count") {
    return "آية"
  }
  return ""
}
</script>
<style scoped>
.v-list-item-title {
  font-size: 14px;
}
</style>
