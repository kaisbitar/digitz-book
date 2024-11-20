<template>
  <div class="mb-4">
    <span class="text-h3 font-weight-bold">{{
      selectedTarteel.inputText
    }}</span>
    <span class="count-key-item mr-3 text-caption">ومشتقاتها</span>
    <span class="pa-4 count-key-item">
      <span class="text-h3">{{ selectedTarteel.results.length }}</span>
      <span class="ml-3 text-caption">مشتق</span>
      <span class="text-h3">{{ distinctSuras.length }}</span>
      <span class="ml-3 text-caption">سورة</span>
      <span class="text-h3"> {{ uniqueVersesCount }}</span>
      <span class="ml-3 text-caption">آية</span>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})

const distinctSuras = computed(() => {
  return [
    ...new Set(props.selectedTarteel.results.flatMap((result) => result.suras)),
  ].sort()
})

const uniqueVersesCount = computed(() => {
  const allVerses = props.selectedTarteel.results.flatMap(
    (result) => result.verses
  )

  const uniqueVerses = new Set(
    allVerses.map((verse) => verse.verseNumberToQuran)
  )

  return uniqueVerses.size
})
</script>
