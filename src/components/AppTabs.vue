<template>
  <v-tabs v-model="computedTab" class="sura-tabs">
    <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name">
      <v-icon v-if="item.icon" start :icon="item.icon" />
      {{ item.title }}
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

<style scoped>
.sura-tabs {
  max-width: 100%;
}
</style>
