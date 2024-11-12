<template>
  <div :class="['mb-4', { 'additional-search': !isOriginal }]">
    <v-chip
      :color="isOriginal ? 'primary' : 'secondary'"
      class="mb-2"
      size="small"
    >
      {{ isOriginal ? "البحث الأصلي:" : "بحث إضافي:" }} "{{ search.inputText }}"
    </v-chip>

    <WordCardItem
      v-for="(ratl, index) in search.results"
      :key="`${isOriginal ? 'original' : 'additional'}-${searchIndex}-${index}`"
      :class="{
        'active-word-card-item':
          selectedRatlIndex === index && selectedSearchIndex === searchIndex,
      }"
      :ratl="ratl"
      :index="index"
      :searchIndex="searchIndex"
      @select="(ratl, index) => $emit('select', ratl, index, searchIndex)"
      @deleteRatl="(index) => $emit('deleteRatl', index, searchIndex)"
    />
  </div>
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
  selectedSearchIndex: {
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
