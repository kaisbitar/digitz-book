<template>
  <v-tooltip
    v-model="showWordMeaningTip[wordIndex]"
    location="bottom"
    :open-delay="300"
    :open-on-hover="false"
  >
    <template v-slot:activator="{ props }">
      <!-- @mouseover="handleHover(word)" -->
      <span v-bind="props" @click="handleClick(word)">
        {{ word }}
      </span>
    </template>
    <v-progress-circular v-if="loading" indeterminate />
    <span v-if="!loading">{{ currentMeaning?.[0]?.meaning }}</span>
  </v-tooltip>
</template>

<script setup>
const props = defineProps({
  word: { type: String, required: true },
  wordIndex: { type: Number, required: true },
  closeTootip: { type: Boolean, required: false },
  inputText: { type: String, required: false },
  wordSelectedOnChart: { type: Array, required: false },
  currentWord: { type: String, required: true },
  currentMeaning: { type: Array, required: true },
  loading: { type: Boolean, required: false },
  meanings: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(["update:hoverWordIndex", "update:clickWordIndex"])
const showWordMeaningTip = reactive({})

const closeLastTooltips = (index) => {
  showWordMeaningTip[index] = false
}

const closeAllTooltips = () => {
  Object.keys(showWordMeaningTip).forEach((word) => {
    showWordMeaningTip[word] = false
  })
}

const handleHover = async (word) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  emit("update:hoverWordIndex", props.wordIndex)
}

const handleClick = () => {
  emit("update:clickWordIndex", props.wordIndex)
}

defineExpose({ closeAllTooltips, closeLastTooltips })
</script>

<style scoped></style>
