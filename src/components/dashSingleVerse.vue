<template>
  <v-card flat>
    <v-tabs class="" v-model="tab" background-color="mt-n5 pr-1 pl-2" centered>
      <v-tab class="dashTabs" href="#tab-1"><span class=" ml-1">آية</span>{{verseIndex}}</v-tab>
      <v-tab class="dashTabs" href="#tab-2">{{numberOfWords}}<span class=" mr-1">كلمة </span></v-tab>
      <v-tab class="dashTabs" href="#tab-3">{{numberOfLetters}}<span class=" mr-1"> حرف </span></v-tab>
      <v-tab class="dashTabs" href="#tab-3" disabled>{{verseNumberToQuran}}<span class=""> مصحف </span></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" >
      <div @click="$emit('backBtnClicked')"><v-icon class="ml-2"> mdi-arrow-right</v-icon>الآيات</div>
      <v-tab-item value="tab-1">
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
          <appChart
            class="webKitWidth"
            :isLoading="isLoading"
            :series="verseChart"
            :options="options"
            :height="height"
          />
        </div>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <dashWords
          class="webKitWidth"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :indexes="wordIndexes"
          :suraText="verseText"
          :isLoading="isLoading"
          :includeTab="true"
        />
      </v-tab-item>
      <v-tab-item value="tab-3">
        <dashLetters
          class="webKitWidth"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :suraText="verseText"
          :isLoading="isLoading"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import appChart from '../components/appChart.vue'
import dashWords from './dashWords.vue'
import dashLetters from './dashLetters.vue'
import dashVersesLabels from './dashVersesLabels'

export default {
  name: 'dashSingleVerse',
  props: [
    'verseIndex',
    'verseNumberToQuran',
    'numberOfLetters',
    'numberOfWords',
    'verseText',
    'inputText',
    'secondInput',
    'suraName',
    'isLoading',
    'verseChart',
    'options',
    'height',
    'wordIndexes'
  ],
  components: { dashVersesLabels, appChart, dashWords, dashLetters },
  data: () => ({
    tab: 'tab-1'
  }),
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style>
</style>
