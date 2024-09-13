<template>
  <div class="d-flex">
    <v-chip-group class="auto-chips black-text" mandatory show-arrows>
      <div v-for="(item, index) in chipsData" :key="index">
        <div :class="{ 'not-active': index !== selectedChipIndex }">
          <div class="d-flex labels-holder mr-3">
            <span class="bg-blue text-white px-1 ml-2">
              {{ item.resultsCount }}
            </span>
          </div>
          <v-chip
            closable
            @click:close="$emit('chipRemoved', index)"
            @click.prevent="$emit('chipClicked', index)"
          >
            {{ item.inputText }}
          </v-chip>
        </div>
      </div>
    </v-chip-group>
  </div>
</template>

<script setup>
// import { fetchAIResponse } from '../api/api.js'

const props = defineProps({
  chipsData: Array,
  selectedChipIndex: Number,
})
const emit = defineEmits(['chipClicked', 'chipRemoved'])

// const handleChipClick = async (index, word) => {
//   emit('chipClicked', index)
//   const response = await fetchAIResponse(
//     'http://localhost:11434',
//     'five different meanings of ' + word + '? write response in arabic',
//   )
//   window.alert(response.response)
// }
</script>

<style>
.autoChips .v-chip__content {
  font-size: 16px;
  font-weight: bold;
}
.notActive {
  opacity: 0.2;
}
span.v-badge.theme--light {
  padding-right: 6px;
  margin-bottom: 12px;
}
.labelsHolder {
  width: max-content;
  font-size: 10px;
  position: absolute;
  z-index: 1;
}
</style>
