<template>
  <v-toolbar height="40">
    <v-spacer></v-spacer>
    <v-btn size="small" icon @click="$emit('close')">
      <v-icon>mdi-less-than</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script setup>
import { onMounted } from "vue"

const emit = defineEmits(["close"])
</script>

<style lang="scss" scoped>
.v-toolbar {
  background: rgb(var(--v-theme-second-background)) !important;
  color: rgb(var(--v-theme-on-second-background)) !important;
}
</style>
