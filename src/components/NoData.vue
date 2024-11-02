<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-icon :icon="icon" size="x-large" class="mb-4"></v-icon>
        <v-card variant="plain" class="pa-4">
          <v-card-text class="text-h6">{{ text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
})
</script>
