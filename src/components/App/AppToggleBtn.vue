<template>
  <v-btn
    @click="$emit('toggle')"
    :variant="btnVariant"
    :color="isActive ? inactiveColor : activeColor"
    :size="size"
  >
    <v-scale-transition>
      <v-badge
        v-if="badgeContent"
        :key="badgeContent"
        class="custom-badge"
        size="small"
        :content="badgeContent"
        :color="badgeColor"
        offset-x="-3"
        offset-y="-15"
        bordered
        :z-index="2"
      />
    </v-scale-transition>

    <v-icon v-if="isActive" class="ml-2">{{ activeIcon }}</v-icon>
    <v-icon v-else class="ml-2">{{ inActiveIcon }}</v-icon>
    <span v-show="$vuetify.display.smAndUp && showText">
      {{ btnText }}
    </span>
  </v-btn>
</template>

<script setup>
defineProps({
  badgeColor: {
    type: String,
    default: "error",
  },
  badgeContent: {
    type: String,
    default: "",
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
