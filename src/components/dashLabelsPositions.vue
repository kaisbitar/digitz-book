<template>
  <v-card class="webKitWidth" flat>
    <dashLabels
      :detailElement="detailElement"
      :detailCount="detailCount"
      :isLoading="isLoading"
      :showPosition="false"
    />
    <div class="mt-2 mr-2">المواقع:</div>
    <v-row class="wordItemWrap mr-2 mt-4 ml-0">
      <div class="wordItem" v-for="(item, key) in positions" :key="key">
        <span>{{ item }}</span>
      </div>
    </v-row>
    <v-overlay
      :model-value="isLoading"
      color="white"
      :opacity="0.8"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import DashLabels from './dashLabels.vue'

const props = defineProps({
  detailElement: String,
  detailCount: Number,
  detailsData: Object,
  isLoading: Boolean,
  showPosition: Boolean,
})

const positions = ref(null)

const extractItem = () => {
  if (!props.detailsData) return
  positions.value = props.detailsData[props.detailElement]
}

watch(() => props.detailsData, extractItem)
watch(() => props.detailElement, extractItem)

onMounted(extractItem)
</script>

<style>
.wordItemWrap {
  overflow-y: scroll;
  max-height: 200px;
}
</style>
