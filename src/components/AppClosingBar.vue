<template>
  <div class="closing-button">
    <v-chip
      variant="flat"
      color="red-darken-4"
      class="text-black font-bold"
      size="x-small"
      @click="$emit('close')"
    >
    </v-chip>
  </div>
</template>

<script setup>
import { onMounted } from "vue"

const emit = defineEmits(["close"])
</script>

<style lang="scss">
.closing-button {
  width: 44px;
  margin-right: auto;
  z-index: 52;
  margin-left: -22px;
  margin-bottom: -26px;
  zoom: 0.7;
}
</style>
