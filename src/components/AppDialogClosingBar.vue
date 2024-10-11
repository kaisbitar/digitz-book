<template>
  <v-toolbar height="40" border>
    <v-spacer></v-spacer>
    <v-btn size="small" icon @click="$emit('close')">
      <v-icon>mdi-less-than</v-icon>
    </v-btn>
  </v-toolbar>
  <div v-if="closingBarData" class="dialog-header">
    <AppCountChips
      :wordCount="closingBarData.wordCount"
      :versesCount="closingBarData.versesCount"
      :letterCount="closingBarData.letterCount"
      :labels="closingBarData.labels"
    />
    <span class="mr-2 highlight-match">{{ closingBarData.inputText }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  closingBarData: Object,
})
const emit = defineEmits(["close"])
</script>

<style lang="scss" scoped>
.v-toolbar {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-second-background)) !important;
}
</style>
