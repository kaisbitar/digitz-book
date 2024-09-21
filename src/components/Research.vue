<template>
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
      closable
      @click:close="$emit('chipRemoved', index)"
    >
      <span class="theme-text-color">{{ item.inputText }}</span>
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  chipsData: Array,
  selectedChipIndex: Number,
})

const emit = defineEmits(["chipClicked", "chipRemoved"])

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
