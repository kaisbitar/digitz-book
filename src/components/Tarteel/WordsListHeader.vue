<template>
  <div class="d-flex align-center flex-wrap ga-2">
    <span class="text-h5 text-sm-h4 font-weight-bold">
      {{ selectedTarteel.inputText.trim() + "ـ" }}
    </span>
    <div class="d-flex align-center flex-wrap">
      <span
        v-for="item in formattedCounts"
        :key="item.label"
        class="d-inline-flex align-baseline ms-3"
      >
        <span class="text-body-2 font-weight-bold count-key-item">
          {{ item.value }}
        </span>
        <span class="text-caption text-medium-emphasis me-1">
          {{ item.label }}
        </span>
      </span>
    </div>
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
