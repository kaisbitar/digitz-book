<template>
  <div class="titleWrap">
    <h2 class="mt-5">{{ title }}</h2>
    <!-- <div class="arrowsWrap">
      <div @click="arrowClick('up')">
        <v-icon>mdi-chevron-up</v-icon>
      </div>
      <div @click="arrowClick('down')">
        <v-icon class="downArr">mdi-chevron-down</v-icon>
      </div>
    </div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
})

const emit = defineEmits(['arrowClick'])

const arrowClick = direction => {
  emit('arrowClick', direction)
}
</script>

<style>
.titleWrap {
  width: 200px;
  display: flex;
  margin-bottom: 5px;
}
.arrowsWrap {
  width: -webkit-fit-content;
  margin-right: auto;
  cursor: pointer;
}
@media (max-width: 600px) {
}
</style>
