<template>
  <template v-if="type === 'normal'">
    <span v-for="(word, idx) in words" :key="idx" class="word">
      {{ word }} &nbsp;
    </span>
  </template>
  <div v-else class="sequence-container">
    <div v-if="letterCount" class="letter-count">
      {{ letterCount }}
      <span
        v-if="difference !== undefined && difference !== 0"
        class="difference"
        :class="{
          plus: difference > 0,
          minus: difference < 0,
        }"
      >
        {{ difference > 0 ? "+" : "" }}{{ difference }}
      </span>
    </div>
    <div :class="['highlighted-sequence', highlightClass]">
      {{ words.join(" ") }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: String,
  words: Array,
  letterCount: Number,
  highlightClass: String,
  difference: Number,
})
</script>

<style scoped>
.sequence-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 4px;
  position: relative;
}

.letter-count {
  position: absolute;
  top: -20px;
  font-size: 0.8rem;
  background: #f5f5f5;
  padding: 0 8px;
  border-radius: 12px;
  color: #666;
}

.highlighted-sequence {
  padding: 4px 8px;
  border-radius: 4px;
}

.word {
  padding: 2px 4px;
}

.difference {
  font-size: 0.7rem;
  margin-left: 4px;
  color: #666;
}

.difference.plus {
  color: #4caf50;
}

.difference.minus {
  color: #f44336;
}
</style>
