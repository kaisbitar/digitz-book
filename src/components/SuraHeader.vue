<template>
  <div
    class="d-flex flex-wrap mb-1"
    :class="breakpoint === 'mobile' ? 'flex-column' : ''"
    justify="space-between"
  >
    <div class="mb-1 ml-2">
      <h1 :style="{ color: $vuetify.theme.currentTheme }">
        {{ title }}
      </h1>
      <AppCountChips
        :wordCount="numberOfWords"
        :versesCount="numberOfVerses"
        :letterCount="numberOfLetters"
        sura
      />
    </div>
    <v-tabs
      v-model="computedTab"
      fixed-tabs
      grow
      density="comfortable"
      class="sura-tabs"
    >
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :value="item.name"
        :icons="item.icon"
      >
        <v-icon v-if="item.icon" class="ml-1" :icon="item.icon" />
        {{ item.title }}
      </v-tab>
    </v-tabs>
  </div>
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
.sura-tabs {
  min-height: 50px;
  margin-bottom: 4px;
}
.v-tab--selected {
  background-color: rgba(255, 255, 255, 0.12);
}
.v-tabs--density-comfortable {
  --v-tabs-height: auto !important;
}
.v-tab {
  color: rgb(var(--v-theme-on-surface));
}
.v-tab--selected {
  color: rgb(var(--v-theme-on-active-row));
}
</style>
