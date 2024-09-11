<template>
  <div class="wrapper">
    <v-row outlined class="pa-2 grey lighten-4" id="suraBlock" :style="getHeight()">
      <suraTextBox
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
import suraTextBox from './suraTextBox.vue'

// Props
const props = defineProps([
  'numberOfVerses',
  'numberOfWords',
  'numberOfLetters',
  'suraTextArray',
  'inputText',
  'suraTargetedVerseIndex',
  'isLoading',
])

// Store
const store = useQuranStore()

// Reactive data
const windowHeight = ref(window.innerHeight)

// Methods
const scrollOptions = () => ({
  duration: 1,
  offset: 2,
  easing: 'easing',
})

const getHeight = () => {
  const heightDif = windowHeight.value - 140
  return `height:${heightDif}px`
}

// Computed properties
const suraselectedSearch = computed(() => store.getSelectedSearchIndex)
const wrapperHeight = computed(() => {
  const filterSectionDOM = document.getElementById('wrapper')
  return filterSectionDOM ? filterSectionDOM.offsetHeight : 'auto'
})
const fileName = computed(() => store.state.target.fileName)

// Watchers
watch(windowHeight, () => {
  getHeight()
})

// Lifecycle hooks
onMounted(() => {
  // Add any mounted logic here
})

// Expose methods and properties to the template
defineExpose({
  scrollOptions,
  getHeight,
})
</script>

<style>
#suraBlock {
  padding-right: 9px;
  padding-left: 9px;
  /*grey*/
  border: 1px solid #9e9e9e !important;
  overflow-y: scroll;
}
.sadakAllah {
  height: 40px;
}
</style>
