<template>
  <div class="pt-4">
    <template v-for="(segment, index) in getVerseSegments(item)" :key="index">
      <VerseSegment
        :type="segment.type"
        :words="segment.words"
        :letter-count="countLetters(segment.words.join(' '))"
        :highlight-class="
          segment.type === 'first' ? 'primary-sequence' : 'secondary-sequence'
        "
        :difference="segment.type !== 'normal' ? item.difference : undefined"
        :is-pattern="segment.type !== 'normal'"
      />
    </template>
  </div>
</template>

<script setup>
import VerseSegment from "./VerseSegment.vue"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// Helper function to count Arabic letters
const countLetters = (text) => {
  // Remove diacritics and count remaining Arabic letters
  return text.replace(/[\u064B-\u065F\u0670]/g, "").replace(/\s/g, "").length
}

const getVerseSegments = (item) => {
  if (!item?.words || !item?.firstIndices) return []

  const segments = []

  // Add normal segment before first sequence if needed
  if (item.firstIndices[0] > 0) {
    segments.push({
      type: "normal",
      words: item.words.slice(0, item.firstIndices[0]),
    })
  }

  // Add first sequence
  segments.push({
    type: "first",
    words: item.words.slice(item.firstIndices[0], item.firstIndices[1] + 1),
  })

  // Add normal segment between sequences if needed
  if (item.firstIndices[1] + 1 < item.secondIndices[0]) {
    segments.push({
      type: "normal",
      words: item.words.slice(item.firstIndices[1] + 1, item.secondIndices[0]),
    })
  }

  // Add second sequence
  segments.push({
    type: "second",
    words: item.words.slice(item.secondIndices[0], item.secondIndices[1] + 1),
  })

  // Add normal segment after second sequence if needed
  if (item.secondIndices[1] + 1 < item.words.length) {
    segments.push({
      type: "normal",
      words: item.words.slice(item.secondIndices[1] + 1),
    })
  }

  return segments
}
</script>
