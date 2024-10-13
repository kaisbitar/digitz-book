<template>
  <div class="d-flex mb-1 justify-space-between align-start">
    <span class="text-h4 font-weight-bold ml-2">{{ title }}</span>
    <div class="d-flex align-end">
      <AppCountChips
        :wordCount="numberOfWords"
        :versesCount="numberOfVerses"
        :letterCount="numberOfLetters"
        :labels="{ word: 'كلمة', verse: 'آية', letter: 'حرف' }"
      />
    </div>
  </div>
  <v-tabs v-model="computedTab" class="sura-tabs">
    <v-tab v-for="(item, index) in tabs" :key="index" :value="item.name">
      <v-icon v-if="item.icon" start :icon="item.icon" />
      {{ item.title }}
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  tabs: Array,
  activeTab: String,
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
})

const emit = defineEmits(["tabChanged"])

const computedTab = computed({
  get: () => props.activeTab,
  set: (newValue) => emit("tabChanged", newValue),
})
</script>

<style scoped>
.sura-tabs {
  max-width: 100%;
}
.v-tab {
  letter-spacing: 0;
}
</style>
