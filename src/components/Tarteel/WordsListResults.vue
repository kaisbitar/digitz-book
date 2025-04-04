<template>
  <v-row dense style="align-content: start">
    <v-col
      v-for="(ratl, index) in search.results"
      :key="index"
      sm="6"
      md="4"
      lg="4"
      style="max-height: 200px"
    >
      <WordCardItem
        :class="{
          'active-word-card-item': selectedRatlIndex === index,
        }"
        :ratl="ratl"
        :index="index"
        :selectedRatlIndex="selectedRatlIndex"
        @select="(ratl, index) => $emit('select', ratl, index)"
        @deleteRatl="(index) => $emit('deleteRatl', index)"
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

<style scoped>
:deep(.v-card) {
  height: 100%;
}
</style>
