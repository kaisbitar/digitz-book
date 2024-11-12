<template>
  <div class="d-inline-flex align-center position-relative ma-1">
    <v-badge
      :color="getBadgeColor"
      :content="letterCount"
      location="top"
      offset-y="-10"
      class="mb-4"
    >
      <div class="pa-2 rounded" :class="getSegmentClass">
        {{ words.join(" ") }}
      </div>
    </v-badge>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  words: {
    type: Array,
    required: true,
  },
  letterCount: {
    type: Number,
    required: true,
  },
  highlightClass: String,
  difference: Number,
  isPattern: {
    type: Boolean,
    default: false,
  },
})

const getBadgeColor = computed(() => {
  if (props.type === "first") return "primary"
  if (props.type === "second") return "secondary"
  return "grey" // Default color for normal segments
})

const getSegmentClass = computed(() => ({
  "bg-primary-lighten-5": props.type === "first",
  "bg-secondary-lighten-5": props.type === "second",
  "text-primary": props.type === "first",
  "text-secondary": props.type === "second",
}))
</script>

<style scoped></style>
