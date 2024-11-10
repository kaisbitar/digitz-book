<template>
  <v-card
    class="mb-2"
    variant="outlined"
    hover
    @click="$emit('select', ratl, index)"
  >
    <v-card-text>
      <v-row align="center">
        <v-col cols="4">
          <div class="text-h6">{{ ratl.word }}</div>
        </v-col>
        <v-btn @click.stop="$emit('deleteRatl', index)">Delete</v-btn>
      </v-row>

      <span class="text-caption ml-4 count-value-item">
        {{ ratl.count }}
        <span class="text-caption count-key-item">مرة</span>
      </span>

      {{ ratl.verses.length }}
      <span class="text-caption count-key-item ml-4">آية</span>

      <span class="text-caption mr-1 count-value-item">
        {{ calculateValue(ratl.word) }}
        <span class="text-caption count-key-item">مرقوم</span>
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
const { calculateValue } = useCounting()

defineProps({
  ratl: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

defineEmits(["select", "deleteRatl"])
</script>
