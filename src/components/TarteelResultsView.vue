<template>
  <!-- <div v-if="selectedData">
    <h2>{{ selectedData.inputText }}</h2>
    <div v-for="word in selectedData.selectedWords" :key="word.word">
      <h3>{{ word.word }} ({{ word.count }})</h3>
      <ul>
        <li v-for="verse in word.verses" :key="verse.verseId">
          {{ verse.verse }}
        </li>
      </ul>
    </div>
  </div> -->
  <v-expansion-panels v-if="selectedTarteel">
    <v-expansion-panel
      v-for="(tarteelItem, index) in selectedTarteel.results"
      :key="index"
    >
      <v-divider></v-divider>
      <v-expansion-panel-title>
        {{ tarteelItem.word }}
        <template v-slot:actions>
          <v-badge :content="tarteelItem.count" color="word-count"></v-badge>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list v-for="verse in tarteelItem.verses" :key="verse.verseId">
          {{ tarteelItem }}
          <VerseCardItem :item="verse" />
          <!-- <v-list-item v-for="verse in wordList.verses" :key="verse.verseId">
            <v-list-item-title>{{ verse.verse }}</v-list-item-title>
            <v-list-item-subtitle
              >Verse ID: {{ verse.verseId }}</v-list-item-subtitle
            >
          </v-list-item> -->
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import VerseCardItem from "./VerseCardItem.vue"

const props = defineProps({
  selectedTarteel: {
    type: Object,
    default: null,
  },
})
onMounted(() => {
  console.log("selectedTarteel", props.selectedTarteel)
})
</script>
