<template>
  <div class="d-flex autoCompleteOptionsBar">
    <v-row class="mb-3 mr-4">
      <v-btn color="green-lighten-2" class="text-white" @click="emit('btn1Clicked')" size="small">
        {{ btn1Title }}
      </v-btn>
      <v-card class="elevation-0 searchLabel label mr-4 px-2" variant="outlined">
        <span v-if="textValue" class="bg-yellow ml-1">"{{ textValue }}" </span>
        <span class="text-h6 mt-n6"> {{ resultCounter }}</span> آية
      </v-card>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  btn1Title: String,
  resultCounter: Number,
  btn2Title: String,
  secondBtnCondition: Number,
  textValue: String,
})

const emit = defineEmits(['btn1Clicked'])
</script>

<style scoped>
/* Add your styles here */
</style>
