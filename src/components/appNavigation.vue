<template>
  <v-btn
    :class="activeRoute === 'sura' ? 'selected' : 'not-selected'"
    @click="$emit('navigateTo', 'sura')"
    icon
  >
    <v-icon>mdi-book-open-variant</v-icon>
  </v-btn>

  <v-btn
    :class="activeRoute === 'search' ? 'selected' : 'not-selected'"
    @click="$emit('navigateTo', 'search')"
    size="small"
    variant="outlined"
  >
    <v-icon>mdi-magnify</v-icon>
    ابحث في القرآن
  </v-btn>
</template>

<script setup>
defineEmits(["navigateTo"])
defineProps(["activeRoute"])
</script>

<style scoped>
.selected {
  opacity: 0.4 !important;
}
</style>
