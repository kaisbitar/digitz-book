<template>
  <v-toolbar color="surface">
    <h1 class="ml-10">{{ title }}</h1>
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
  </v-toolbar>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps(["tabs", "activeTab", "title"])
const emit = defineEmits(["tabChanged"])

const computedTab = computed({
  get: () => props.activeTab,
  set: (newValue) => emit("tabChanged", newValue),
})
</script>

<style>
.v-tab,
.no-letter-spacing,
.v-btn {
  letter-spacing: 0;
}

.v-tab--selected {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
