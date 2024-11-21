<template>
  <div class="mb-4">
    <span class="text-h4 font-weight-bold">{{
      selectedTarteel.inputText + "ـ"
    }}</span>
    <span class="mr-3 text-caption">ومشتقاتها</span>
    <span class="pa-4">
      <template v-for="(item, index) in counts" :key="index">
        <span class="text-h4 count-key-item">{{ item.count }}</span>
        <span class="ml-3 mr-1 text-caption">{{ item.label }}</span>
      </template>
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

const distinctSurasCount = computed(() => {
  return [
    ...new Set(props.selectedTarteel.results.flatMap((result) => result.suras)),
  ].sort().length
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

const counts = computed(() => [
  { count: props.selectedTarteel.results.length, label: "مشتق" },
  { count: distinctSurasCount, label: "سورة" },
  { count: uniqueVersesCount.value, label: "آية" },
])
</script>
