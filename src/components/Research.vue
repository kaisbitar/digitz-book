<template>
  <v-row
    class="d-flex flex-wrap align-center mb-4"
    :class="breakpoint === 'mobile' ? 'flex-column' : ''"
    justify="space-between"
  >
    <v-col>
      <h1>{{ chipsTitle }}</h1>
      <SearchCountHeader
        :wordCount="chipsData[selectedChipIndex]?.wordCount"
        :versesCount="chipsData[selectedChipIndex]?.versesCount"
      />
    </v-col>
    <v-col> <ResearchTitles /></v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const props = defineProps({
  chipsTitle: String,
  chipsData: Object,
})

const emit = defineEmits(["chipClicked", "chipRemoved", "chipRemoveAll"])
const selectedChipIndex = computed(() => store.getSelectedSearchIndex)
const breakpoint = computed(() =>
  window.innerWidth < 600 ? "mobile" : "desktop"
)
</script>

<style scoped>
@media (max-width: 600px) {
  .flex-column {
    flex-direction: column !important;
  }
}
</style>
