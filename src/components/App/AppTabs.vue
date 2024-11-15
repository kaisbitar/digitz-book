<template>
  <v-tabs v-model="computedTab" show-arrows centered>
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      :value="item.name"
      class="text-caption"
    >
      <v-icon
        v-if="item.icon"
        :icon="item.icon"
        size="small"
        :class="$vuetify.display.smAndUp ? 'ml-2' : ''"
      ></v-icon>
      <span :class="{ 'd-none d-sm-inline': item.icon }">{{ item.title }}</span>
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(["update:activeTab"])

const computedTab = computed({
  get: () => props.activeTab,
  set: (newValue) => emit("update:activeTab", newValue),
})
</script>

<style scoped></style>
