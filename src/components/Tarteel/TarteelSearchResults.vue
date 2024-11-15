<template>
  <div :class="['mb-4', { 'additional-search': !isOriginal }]">
    <v-chip
      :color="isOriginal ? 'primary' : 'secondary'"
      class="mb-2"
      size="small"
    >
      {{ isOriginal ? "البحث الأصلي:" : "بحث إضافي:" }} "{{ search.inputText }}"
    </v-chip>

    <v-row dense>
      <v-col
        v-for="(ratl, index) in search.results"
        :key="`${
          isOriginal ? 'original' : 'additional'
        }-${searchIndex}-${index}`"
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
          @select="(ratl, index) => $emit('select', ratl, index, searchIndex)"
          @deleteRatl="(index) => $emit('deleteRatl', index, searchIndex)"
        />
      </v-col>
    </v-row>
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
  selectedTarteelIndex: {
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
