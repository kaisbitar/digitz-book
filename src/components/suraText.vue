<template>
  <div class="wrapper">
    <v-row outlined :style="getHeight()" id="suraBlock">
      <SuraTextBox
        :inputText="inputText"
        :suraTargetedVerseIndex="suraTargetedVerseIndex"
        :suraTextArray="suraTextArray"
        :isLoading="isLoading"
      />
      <span class="sadakAllah mr-auto white pa-2 mt-1">صدق الله العظيم</span>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useWindowMixin } from '../mixins/windowMixin'

const props = defineProps(['suraTextArray', 'inputText', 'suraTargetedVerseIndex', 'isLoading'])

const store = useQuranStore()
const { getTextBoxHeight } = useWindowMixin()
const windowHeight = ref(window.innerHeight)

const scrollOptions = () => ({
  duration: 1,
  offset: 2,
  easing: 'easing',
})

const getHeight = () => {
  const heightDif = getTextBoxHeight.value - 140
  return `height:${heightDif}px`
}

watch(windowHeight, () => {
  getHeight()
})

onMounted(() => {})

defineExpose({
  scrollOptions,
  getHeight,
})
</script>

<style>
.sadakAllah {
  height: 40px;
}
</style>
