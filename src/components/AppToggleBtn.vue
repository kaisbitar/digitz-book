<template>
  <v-btn
    @click="$emit('toggle')"
    :variant="btnVariant"
    :color="isActive ? inactiveColor : activeColor"
    :size="size"
  >
    <v-icon v-if="isActive" class="ml-2">{{ activeIcon }}</v-icon>
    <v-icon v-else class="ml-2">{{ inActiveIcon }}</v-icon>
    <span v-if="!isActive && showText" v-show="$vuetify.display.smAndUp">
      {{ btnText }}
    </span>
  </v-btn>
</template>

<script setup>
defineProps({
  btnVariant: {
    type: String,
    default: "text",
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  btnText: {
    type: String,
    default: "",
  },
  showText: {
    type: Boolean,
    default: true,
  },
  activeColor: {
    type: String,
  },
  inactiveColor: {
    type: String,
    default: "default",
  },
  activeIcon: {
    type: String,
    default: "mdi-arrow-right",
  },
  inActiveIcon: {
    type: String,
    default: "mdi-magnify",
  },
  size: {
    type: String,
    default: "small",
  },
})

const emit = defineEmits(["toggle"])
</script>
