<template>
  <v-btn
    class="mx-2"
    @click="$emit('toggle')"
    :color="isVisible ? 'secondary' : 'default'"
  >
    <span v-if="!isVisible" v-show="$vuetify.display.smAndUp" class="ml-2">
      {{ buttonText }}
    </span>
    <v-icon class="ml-1">{{ isVisible ? "mdi-close" : "mdi-magnify" }}</v-icon>
    <!-- <span v-show="isVisible">إغلاق</span> -->
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

defineEmits(["toggle"])
</script>
