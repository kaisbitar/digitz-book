<template>
  <v-row no-gutters align="center">
    <v-col v-if="chipsTitle" cols="3">
      <v-toolbar-title>"{{ chipsTitle }}"</v-toolbar-title>
    </v-col>
    <v-row align="center">
      <v-tooltip location="right" open>
        <template #activator="{ props }">
          <v-icon
            v-if="deletable"
            v-bind="props"
            class="mt-3"
            size="x-small"
            color="red-lighten-2"
            @click="$emit('chipRemoveAll')"
            >mdi-delete</v-icon
          >
        </template>
        <span>Remove all chips</span>
      </v-tooltip>
      <v-chip-group
        :v-model="selectedChipIndex"
        mandatory
        show-arrows
        color="primary"
        variant="tonal"
        @update:modelValue="$emit('chipClicked', $event)"
      >
        <v-chip
          v-for="(item, index) in chipsData"
          :key="index"
          :class="chipClasses(index)"
          :closable="closable"
          prepend-icon="mdi-magnify"
          icon-size="x-small"
          @click:close="$emit('chipRemoved', index)"
        >
          <span class="theme-text-color">{{ item }}</span>
        </v-chip>
      </v-chip-group>
    </v-row>
  </v-row>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  chipsTitle: String,
  chipsData: Array,
  selectedChipIndex: Number,
  closable: {
    type: Boolean,
    default: false,
  },
  deletable: {
    type: Boolean,
    default: true,
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
.count-color,
.custom-close-icon ::v-deep(.v-chip__close) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.5 !important;
}
</style>
