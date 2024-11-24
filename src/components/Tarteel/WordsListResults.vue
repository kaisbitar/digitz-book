<template>
  <v-row dense>
    <v-col
      v-for="(ratl, index) in search.results"
      :key="index"
      cols="12"
      sm="6"
      md="4"
      lg="4"
    >
      <WordCardItem
        :class="{
          'active-word-card-item': selectedRatlIndex === index,
        }"
        :ratl="ratl"
        :index="index"
        :selectedRatlIndex="selectedRatlIndex"
        @select="(ratl, index) => $emit('select', ratl, index, searchIndex)"
        @deleteRatl="(index) => $emit('deleteRatl', index, searchIndex)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  search: {
    type: Object,
    required: true,
  },
  searchIndex: {
    type: Number,
    required: true,
  },
  selectedRatlIndex: {
    type: Number,
    required: true,
  },
  isOriginal: {
    type: Boolean,
    default: false,
  },
})

defineEmits(["select", "deleteRatl"])
</script>
