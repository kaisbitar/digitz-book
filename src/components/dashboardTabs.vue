<template>
  <v-card flat>
    <v-tabs v-model="computedTab" bg-color="" align-tabs="center" grow>
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :value="item.name"
        :title="item.title"
        class="text-none"
      >
        {{ item.value }} {{ item.title }}
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['tabs', 'activeTab'])
const emit = defineEmits(['tabChanged'])

const computedTab = computed({
  get: () => props.activeTab,
  set: newValue => emit('tabChanged', newValue),
})
</script>

<style>
.v-tab {
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  font-family: unset;
}

.v-tab--selected {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
