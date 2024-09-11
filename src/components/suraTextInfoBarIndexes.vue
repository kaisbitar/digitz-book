<template>
  <div class="d-lg--flex d-sm--none indexWrapper mt-n1">
    <v-chip-group
      :value="selectedVerse"
      show-arrows
      class="d-flex"
      active-class="primary--text "
      column
    >
      <v-chip
        v-for="(item, index) in items"
        :key="index"
        pill
        small
        class="grey--text darken-1"
        @click="handleClick(item)"
      >
        {{ item }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useQuranStore } from '@/stores/app'

const props = defineProps(['items', 'selectedVerse'])
const emit = defineEmits(['update:selectedVerse'])
const store = useQuranStore()

const handleClick = item => {
  store.setTarget({ fileName: store.getTarget.fileName, verseIndex: item })
  emit('update:selectedVerse', item)
}
</script>

<style scoped>
.indexWrapper {
  max-height: 71px;
  max-width: 483px;
}
</style>
