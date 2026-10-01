<template>
  <div>
    <div class="d-flex align-center">
      <span class="text-h4 font-weight-bold"
        >{{ selectedTarteel.inputText.trim() + "ـ" }}
        <span v-if="!isPhrase" class="ml-6 text-caption">ومشتقاتها</span>
      </span>
    </div>
    <AppHeaderMetrics :metrics="formattedCounts" />
  </div>
</template>

<script setup>
const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})

const isPhrase = computed(() =>
  (props.selectedTarteel.inputText || "").includes(" "),
)

const distinctSurasCount = computed(() => {
  return [
    ...new Set(
      props.selectedTarteel.results.flatMap((result) => result.suras || []),
    ),
  ].sort().length
})

const uniqueVersesCount = computed(() => {
  const allVerses = props.selectedTarteel.results.flatMap(
    (result) => result.verses,
  )

  const uniqueVerses = new Set(
    allVerses.map((verse) => verse.verseNumberToQuran),
  )

  return uniqueVerses.size
})

const formattedCounts = computed(() => [
  {
    value: props.selectedTarteel.results.length,
    label: isPhrase.value ? "نتيجة" : "مشتق",
  },
  { value: distinctSurasCount.value, label: "سورة" },
  { value: uniqueVersesCount.value, label: "آية" },
])
</script>
