<template>
  <!-- <div flat class="appSearchBoxMatch d-flex">
    <span v-if="props.search && matchingStatus" class="matchLabel mt-2">تطابق</span>
    <v-icon
      :color="matchingStatus === false ? 'grey lighten-1' : 'blue'"
      v-if="props.search"
      class="mt-1"
      @click="emit('clicked')"
    >
      mdi-format-letter-matches
    </v-icon>
  </div> -->
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  search: String,
  matchingStatus: Boolean,
})

const emit = defineEmits(['clicked'])
</script>

<style></style>
