<template>
  <v-card flat>
    <v-tabs v-model="computedTab" height="37" grow>
      <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name" :title="item.title">
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
  font-size: 17px;
  font-family: unset;
  letter-spacing: 0;
}
.v-tab {
  height: 26px;
  margin-top: 5px;
}
</style>
