<template>
  <div style="display: contents" @click="handleClick">
    <v-chip label size="small" color="brown-lighten-5" class="mt-7 ml-4 text-black">
      {{ chipTitle }}
    </v-chip>
    <v-list-item-title class="text-blue" v-html="title"></v-list-item-title>
    <v-list-item-title style="max-width: 200px !important" v-html="mainText"></v-list-item-title>
    <v-list-item-subtitle v-html="subtitle"></v-list-item-subtitle>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'mainText', 'chipTitle', 'subtitle'])
const emit = defineEmits(['clicked'])

const handleClick = () => {
  emit('clicked')
}
</script>

<style>
.v-autocomplete__content {
  max-width: 500px;
}
.v-list-item {
  zoom: 1.2;
}

@media (max-width: 600px) {
  .v-autocomplete__content {
    max-width: -webkit-fill-available;
  }
}
</style>
