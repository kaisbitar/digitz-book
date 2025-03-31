<template>
  <v-container class="overflow-y-auto">
    <WordsListHeader :selectedTarteel="selectedTarteel" />

    <v-divider class="mx-auto mb-4" width="100%"></v-divider>

    <v-row style="max-height: 100vh">
      <v-col cols="6">
        <v-card style="height: 40vh" class="mb-3 pa-4 overflow-y-auto">
          <v-card-title>المشتقات</v-card-title>
          <template
            v-for="result in selectedTarteel.results"
            :key="result.word"
          >
            <v-chip class="ma-1" color="primary">{{ result.word }}</v-chip>
          </template>
        </v-card>

        <v-card style="height: 40vh" class="overflow-y-auto px-3">
          <v-card-title>السور</v-card-title>
          <v-card-text>
            <template v-for="result in distinctSuras" :key="result.word">
              <v-chip class="ma-1" color="secondary">{{ result }}</v-chip>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card class="mb-3 pa-4">
          <WordMeaning
            style="height: 80vh"
            class="overflow-y-auto px-3"
            :word="selectedTarteel.inputText"
            :isWordMeaningOpen="true"
            :class="'tarteel-meaning-overflow'"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})
const distinctSuras = computed(() => {
  return [
    ...new Set(props.selectedTarteel.results.flatMap((result) => result.suras)),
  ].sort()
})
const uniqueVersesCount = computed(() => {
  const allVerses = props.selectedTarteel.results.flatMap(
    (result) => result.verses
  )

  const uniqueVerses = new Set(
    allVerses.map((verse) => verse.verseNumberToQuran)
  )

  return uniqueVerses.size
})
</script>
