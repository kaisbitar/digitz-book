<template>
  <div v-click-outside="onClickOutside">
    <div
      v-for="(word, index) in verseWords"
      :key="index"
      class="word"
      :class="{
        'text-blue-darken-4':
          index === wordSelectedOnChart[wordSelectedOnChart.length - 1],
      }"
    >
      <WordTooltip
        ref="wordTooltips"
        :word="word"
        :wordIndex="index"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
        :closeTootip="closeTootip"
        @update:clickedWordIndex="handleWordClick"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
  wordSelectedOnChart: {
    type: Array,
    required: false,
  },
  inputText: {
    type: String,
    required: false,
  },
})
const closeTootip = ref(false)
const verseWords = computed(() => props.verse.split(" "))
const wordTooltips = ref([])
const lastClickedWordIndex = ref(null)

const handleWordClick = (index) => {
  if (lastClickedWordIndex.value === index) return
  wordTooltips.value[lastClickedWordIndex.value]?.closeLastTooltips(
    lastClickedWordIndex.value
  )
  lastClickedWordIndex.value = index
}

const onClickOutside = () => {
  wordTooltips.value.forEach((tooltip) => {
    if (tooltip) {
      tooltip.closeAllTooltips()
    }
  })
}
</script>

<style lang="scss">
.tooltip-meaning {
  max-width: 482px;
  position: relative !important;
  pointer-events: auto;
}

.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 22px;
}

.word:hover {
  color: #007bff;
}
</style>
