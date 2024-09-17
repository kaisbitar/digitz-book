<template>
  <v-card flat>
    <v-tabs v-model="tab" bg-color="mt-n5 pr-1 pl-2" centered>
      <v-tab value="tab-1" class="dashTabs"><span class="ml-1">آية</span>{{ verseIndex }}</v-tab>
      <v-tab value="tab-2" class="dashTabs"
        >{{ numberOfWords }}<span class="mr-1">كلمة </span></v-tab
      >
      <v-tab value="tab-3" class="dashTabs"
        >{{ numberOfLetters }}<span class="mr-1"> حرف </span></v-tab
      >
      <v-tab value="tab-4" class="dashTabs" disabled
        >{{ verseNumberToQuran }}<span class=""> مصحف </span></v-tab
      >
    </v-tabs>

    <v-window v-model="tab">
      <div @click="$emit('backBtnClicked')">
        <v-icon class="ml-2">mdi-arrow-right</v-icon>الآيات
      </div>

      <v-window-item value="tab-1">
        <dashVersesLabels
          class="ml-2 mb-2"
          :verseIndex="verseIndex"
          :verseNumberToQuran="verseNumberToQuran"
          :numberOfLetters="numberOfLetters"
          :numberOfWords="numberOfWords"
          :verseText="verseText"
          :inputText="inputText"
          :secondInput="secondInput"
          :suraName="suraName"
        />
        <div class="d-flex">
          <appChart class="webKitWidth" :series="verseChart" :options="options" :height="height" />
        </div>
      </v-window-item>

      <v-window-item value="tab-2">
        <dashWords
          class="webKitWidth"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :indexes="wordIndexes"
          :suraText="verseText"
          :includeTab="true"
        />
      </v-window-item>

      <v-window-item value="tab-3">
        <dashLetters
          class="webKitWidth"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :suraText="verseText"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import appChart from '../components/appChart.vue'
import dashWords from './dashWords.vue'
import dashLetters from './dashLetters.vue'
import dashVersesLabels from './dashVersesLabels.vue'

// Props
const props = defineProps({
  verseIndex: Number,
  verseNumberToQuran: Number,
  numberOfLetters: Number,
  numberOfWords: Number,
  verseText: String,
  inputText: String,
  secondInput: String,
  suraName: String,

  verseChart: Array,
  options: Object,
  height: [String, Number],
  wordIndexes: Array,
})

// Emits
const emit = defineEmits(['backBtnClicked'])

// Reactive state
const tab = ref('tab-1')
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
