<template>
  <v-container class="d-flex">
    <v-icon
      @click="$emit('chipRemoveAll')"
      color="red-lighten-2"
      size="small"
      class="mt-3"
      >mdi-delete</v-icon
    >
    <v-chip-group
      :v-model="selectedChipIndex"
      @update:modelValue="$emit('chipClicked', $event)"
      mandatory
      show-arrows
      color="primary"
      variant="outlined"
    >
      <v-chip
        v-for="(item, index) in chipsData"
        :key="index"
        :class="chipClasses(index)"
        :closable="closable"
        @click:close="$emit('chipRemoved', index)"
      >
        <span class="theme-text-color">{{ item }}</span>
      </v-chip>
    </v-chip-group>
  </v-container>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  chipsData: Array,
  selectedChipIndex: Number,
  closable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["chipClicked", "chipRemoved", "chipRemoveAll"])

const chipClasses = computed(() => (index) => [
  index === props.selectedChipIndex ? "selected-chip" : "not-selected",
  "custom-close-icon",
])
</script>

<style scoped>
.selected-chip {
  color: rgb(var(--v-theme-primary)) !important;
}
.theme-text-color {
  color: rgb(var(--v-theme-on-surface)) !important;
}
.count-color,
.custom-close-icon ::v-deep(.v-chip__close) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.5 !important;
}
</style>
