<template>
  <v-tabs v-model="computedTab">
    <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name">
      <template v-slot:default>
        <v-icon v-if="item.icon" :icon="item.icon" class="ml-2"></v-icon>
        <!-- <span v-show="$vuetify.display.smAndUp">{{ item.title }}</span> -->
      </template>
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
