<template>
  <div @click="handleClick" class="d-flex ma-2">
    <v-chip label size="small" color="brown" class="mr-2">
      {{ chipTitle }}
    </v-chip>
    <v-list-item>
      <v-list-item-title class="text-blue" v-html="title"></v-list-item-title>
      <v-list-item-title
        class="main-text"
        v-html="mainText"
      ></v-list-item-title>
      <v-list-item-subtitle v-html="subtitle"></v-list-item-subtitle>
    </v-list-item>
  </div>
</template>

<script setup>
const props = defineProps(["title", "mainText", "chipTitle", "subtitle"])
const emit = defineEmits(["clicked"])

const handleClick = () => {
  emit("clicked")
}
</script>

<style>
.v-autocomplete__content {
  max-width: 500px;
}

.main-text {
  max-width: 200px !important;
}

@media (max-width: 600px) {
  .v-autocomplete__content {
    max-width: 100%;
  }
}
</style>
