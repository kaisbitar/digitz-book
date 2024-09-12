<template>
  <div class="d-flex autoCompleteOptionsBar">
    <v-row class="mb-3 mr-4">
      <v-btn class="green lighten-2 white--text" @click="emit('btn1Clicked')" small>{{
        props.btn1Title
      }}</v-btn>
      <v-card class="elevation-0 searchLabel label mr-4 pl-2 pr-2" outlined>
        <span v-if="props.textValue" class="yellow ml-1">"{{ props.textValue }}" </span>
        <span class="title mt-n6"> {{ props.resultCounter }}</span> آية
      </v-card>
      <div v-if="props.secondBtnCondition > -1" class="mr-4">
        أو
        <v-btn class="blue lighten-2 white--text mr-4" @click="emit('btn2Clicked')" small>{{
          props.btn2Title
        }}</v-btn>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  btn1Title: String,
  resultCounter: null,
  btn2Title: String,
  secondBtnCondition: Number,
  textValue: String,
})

const emit = defineEmits(['btn1Clicked', 'btn2Clicked'])
</script>

<style scoped>
/* Add your styles here */
</style>
