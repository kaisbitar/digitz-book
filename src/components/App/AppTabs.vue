<template>
  <v-card>
    <v-tabs grow align-tabs="center" mobile v-model="computedTab">
      <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name">
        <v-icon class="ml-2" v-if="item.icon" :icon="item.icon"></v-icon>
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
