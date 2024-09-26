<template>
  <v-row no-gutters align="center">
    <v-col v-if="chipsTitle" cols="2">
      <v-toolbar-title>"{{ chipsTitle }}"</v-toolbar-title>
    </v-col>
    <v-col class="theme-text-color ma-3" cols="4">
      ذكرت:
      <v-chip size="large" color="green"
        >{{ chipsData[selectedChipIndex]?.wordCount }} مرة
      </v-chip>
      في:
      <v-chip size="large" color="blue"
        >{{ chipsData[selectedChipIndex]?.versesCount }} آية
      </v-chip>
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
        <span>حذف الكل</span>
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
          icon-size="large"
          @click:close="$emit('chipRemoved', index)"
        >
          <span class="chip-number">{{ index + 1 }}</span>
          <span class="theme-text-color">{{ item.inputText }}</span>
        </v-chip>
      </v-chip-group>
    </v-row>
  </v-row>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  chipsTitle: String,
  chipsData: Object,
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
