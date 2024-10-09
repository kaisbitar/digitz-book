<template>
  <v-radio-group v-model="type" class="d-flex chartTitleWrap align-left">
    <v-radio value="words" label="كلمات" color="blue"></v-radio>
    <v-radio value="letters" label="حروف" color="blue"></v-radio>
  </v-radio-group>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps(["initialType"])
const emit = defineEmits(["typeChanged"])

const type = ref("")

watch(
  () => props.initialType,
  (newValue) => {
    type.value = newValue
  }
)

watch(type, (newValue) => {
  emit("typeChanged", newValue)
})

onMounted(() => {
  type.value = "words"
})
</script>

<style>
.chartTitleWrap {
  position: absolute;
  z-index: 4;
  /* width: 262px;
  margin-top: 25px !important;
  background: #f0f8ff00; */
}
</style>
