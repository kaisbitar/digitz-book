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

        <v-col cols="3">
          <span class="text-caption mr-1 count-value-item">
            {{ ratl.count }}
            <span class="text-caption count-key-item">مرة</span>
          </span>
        </v-col>

        <v-col cols="2">
          <span class="text-caption mr-1 count-value-item">
            {{ ratl.verses.length }}
            <span class="text-caption count-key-item">آية</span>
          </span>
        </v-col>

        <v-col cols="2">
          <span class="text-caption mr-1 count-value-item">
            {{ calculateWordValue(ratl.word) }}
            <span class="text-caption count-key-item">مرقوم</span>
          </span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
const { calculateWordValue } = useCounting()

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

defineEmits(["select"])
</script>
