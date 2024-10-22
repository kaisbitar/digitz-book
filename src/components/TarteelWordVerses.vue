<template>
  <div class="tarteel-word-verses">
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, index) in wordData" :key="index">
        <v-expansion-panel-title>
          {{ item.word }}
          <template v-slot:actions>
            <v-badge :content="item.count" color="word-count"></v-badge>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list>
            <v-list-item v-for="verse in item.verses" :key="verse.verseId">
              <v-list-item-title>{{ verse.verse }}</v-list-item-title>
              <v-list-item-subtitle
                >Verse ID: {{ verse.verseId }}</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
import { defineProps } from "vue"

const props = defineProps({
  wordData: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.tarteel-word-verses {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
