<template>
  <!-- <v-toolbar class="mb-n16"> -->
  <!-- <v-spacer></v-spacer>
  <v-btn icon @click="$emit('close')" class="closing-button">
    <v-icon>mdi-arrow-left</v-icon>
  </v-btn> -->
  <!-- </v-toolbar> -->
  <div class="closing-button">
    <v-btn icon @click="$emit('close')" variant="flat">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <!-- <v-chip
      variant="flat"
      color="red-darken-4"
      size="x-small"
      @click="$emit('close')"
    >
    </v-chip> -->
  </div>
</template>

<script setup>
import { onMounted } from "vue"

const emit = defineEmits(["close"])
</script>

<style lang="scss" scoped>
.closing-button {
  width: 44px;
  margin-right: auto;
  z-index: 52;
  margin-left: -22px;
  margin-bottom: -26px;
}
.v-toolbar {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}
</style>
