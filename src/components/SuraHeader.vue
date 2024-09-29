<template>
  <v-row
    class="d-flex flex-wrap align-center mb-4"
    :class="breakpoint === 'mobile' ? 'flex-column' : ''"
    justify="space-between"
  >
    <v-col
      ><h1 :style="{ color: $vuetify.theme.currentTheme }">
        {{ title }}
      </h1>
      <AppCountChips
        :wordCount="numberOfWords"
        :versesCount="numberOfVerses"
        :letterCount="numberOfLetters"
        sura
    /></v-col>
    <v-col>
      <v-tabs v-model="computedTab" bg-color="" align-tabs="center" grow>
        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
          :value="item.name"
          :title="item.title"
          class="text-none"
          >{{ item.title }}
        </v-tab>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps([
  "tabs",
  "activeTab",
  "title",
  "numberOfWords",
  "numberOfVerses",
  "numberOfLetters",
])
const emit = defineEmits(["tabChanged"])
const computedTab = computed({
  get: () => props.activeTab,
  set: (newValue) => emit("tabChanged", newValue),
})
const breakpoint = computed(() =>
  window.innerWidth < 600 ? "mobile" : "desktop"
)
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
