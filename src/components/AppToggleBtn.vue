<template>
  <v-btn
    @click="$emit('toggle')"
    :variant="btnVariant"
    :color="isActive ? inactiveColor : activeColor"
    :size="size"
  >
    <v-badge
      v-if="badgeContent > 0"
      class="custom-badge"
      size="small"
      :content="badgeContent"
      color="red"
      bg-color="white"
      offset-x="-3"
      offset-y="-13"
      bordered
      :z-index="2"
    />
    <v-icon v-if="isActive" class="ml-2">{{ activeIcon }}</v-icon>
    <v-icon v-else class="ml-2">{{ inActiveIcon }}</v-icon>
    <span v-show="$vuetify.display.smAndUp && showText">
      {{ btnText }}
    </span>
  </v-btn>
</template>

<script setup>
defineProps({
  badgeContent: {
    type: Number,
    default: 0,
  },
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
