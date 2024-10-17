<template>
  <v-btn @click="$emit('toggle')" :color="isVisible ? 'secondary' : 'default'">
    <span v-if="!isVisible" v-show="$vuetify.display.smAndUp" class="ml-2">
      {{ buttonText }}
    </span>
    <v-icon class="ml-1" v-if="isVisible"> mdi-arrow-right </v-icon>
    <v-icon v-else>mdi-magnify </v-icon>
  </v-btn>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(["toggle"])
</script>
