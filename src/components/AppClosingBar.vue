<template>
  <!-- <div class="closing-button">
    <v-btn icon @click="$emit('close')" variant="flat">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </div> -->
  <v-toolbar>
    <v-spacer></v-spacer>
    <v-btn icon @click="$emit('close')">
      <v-icon>mdi-less-than</v-icon>
    </v-btn>
  </v-toolbar>
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
  background: rgb(var(--v-theme-second-background)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}
</style>
