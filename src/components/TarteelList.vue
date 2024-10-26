<template>
  <div class="tarteel-drawer-container">
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
          {{ item.word }}
        </v-list-item-title>
      </template>

      <template v-slot:append>
        <v-badge
          :content="`${item.count} ${getCoutingTypeLabel(item.coutingType)}`"
          :color="item.coutingType"
          offset-x="5"
          offset-y="0"
          inline
        ></v-badge>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click.stop="$emit('deleteItem', index)"
        ></v-btn>
      </template>
    </v-list-item>
    <v-divider horizontal></v-divider>
  </div>
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
})

defineEmits(["selecteItem", "deleteItem"])

const getCoutingTypeLabel = (coutingType) => {
  if (coutingType === "word-count") {
    return "رتل"
  }
  if (coutingType === "verse-count") {
    return "آية"
  }
  return ""
}
</script>
