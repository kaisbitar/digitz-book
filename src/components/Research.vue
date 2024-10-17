<template>
  <v-row class="research-row">
    <v-col cols="5" class="pb-1">
      <h1 class="mb-n1">{{ chipsTitle }}</h1>
      <AppCountChips
        :wordCount="chipsData[selectedChipIndex]?.wordCount"
        :versesCount="chipsData[selectedChipIndex]?.versesCount"
        :labels="{ word: 'مرة', verse: 'آية' }"
      />
    </v-col>
    <v-col>
      <ResearchTitles class="" />
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const props = defineProps({
  chipsTitle: String,
  chipsData: Object,
})

const emit = defineEmits(["chipClicked", "chipRemoved", "chipRemoveAll"])
const selectedChipIndex = computed(() => store.getSelectedSearchIndex)
</script>

<style scoped>
.research-row {
  max-height: 111px;
  overflow: scroll;
  position: relative;
  margin-bottom: 7px;
}
@media (max-width: 600px) {
  .flex-column {
    flex-direction: column !important;
  }
}
</style>
