<template>
  <v-card class="pa-2">
    <v-tabs
      v-model="computedTab"
      :direction="$vuetify.display.xs ? 'vertical' : 'horizontal'"
    >
      <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name">
        <v-icon v-if="item.icon" :icon="item.icon"></v-icon>
        <span>{{ item.title }}</span>
      </v-tab>
    </v-tabs>
  </v-card>
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
