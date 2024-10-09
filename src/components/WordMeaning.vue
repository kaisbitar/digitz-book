<template>
  <div fill-height class="meaning-cards" fluid>
    <v-card
      v-for="(meaning, index) in meanings"
      :key="index"
      class="ma-1"
      elevation="2"
    >
      <v-card-title>
        <h3>{{ meaning.word }}</h3>
      </v-card-title>
      <v-card-text class="meaning">
        <strong>المعنى: </strong
        ><span v-html="highlight(meaning.meaning, word)" />
      </v-card-text>
      <v-card-text>
        <em>المصدر: {{ meaning.dictionary }}</em>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
import { defineProps } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  meanings: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss">
.meaning-cards {
  height: 93%;
  overflow: scroll;
  background: rgb(var(--v-theme-second-background)) !important;
}
</style>
