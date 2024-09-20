<template>
  <div class="appChartOptions">
    <v-row>
      <v-radio-group class="d-flex chartTitleWrap" v-model="type" row>
        تواتر
        <v-radio value="words" label="كلمات" color="blue"></v-radio>
        <v-radio value="letters" label="حروف" color="blue"></v-radio>
      </v-radio-group>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['initialType'])
const emit = defineEmits(['typeChanged'])

const type = ref('')

watch(
  () => props.initialType,
  newValue => {
    type.value = newValue
  },
)

watch(type, newValue => {
  emit('typeChanged', newValue)
})

onMounted(() => {
  type.value = props.initialType
})
</script>

<style></style>
