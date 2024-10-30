<template>
  <div class="d-flex">
    <span class="text-h4 ml-4">{{ title }}</span>
    <AppMetaData :metaData="suraMetaData" />
    <v-btn
      class="mr-auto"
      icon="mdi-arrow-left"
      variant="text"
      @click="goBack"
    ></v-btn>
  </div>
</template>

<script setup>
import AppMetaData from "./AppMetaData.vue"
import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps({
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
  showMetaData: Boolean,
})

const suraMetaData = computed(() => ({
  آية: { value: props.numberOfVerses },
  كلمة: { value: props.numberOfWords },
  حرف: { value: props.numberOfLetters },
}))

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped></style>
