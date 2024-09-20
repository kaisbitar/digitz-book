<template>
  <v-toolbar>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-toolbar>
</template>

<script setup>
const props = defineProps({
  title: String,
})
</script>

<style></style>
