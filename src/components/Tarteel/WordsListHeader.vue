<template>
  <div>
    <span class="text-h4 ml-4">{{ headerTitle }}</span>
    <AppHeaderMetrics :metrics="formattedCounts" />
    <span v-if="soundAlikeCount" class="text-caption text-medium-emphasis">
      دون تشابه صوتي ({{ soundAlikeCount }})
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

const isPhrase = computed(() =>
  (props.selectedTarteel.inputText || "").includes(" "),
)

const headerTitle = computed(() => {
  const searched = (props.selectedTarteel.inputText || "").trim()
  if (isPhrase.value) return searched + "ـ"
  const root = (props.selectedTarteel.wordRoot || "").trim()
  return (root || searched) + "ـ"
})

const results = computed(() => props.selectedTarteel.results || [])

const rootResults = computed(() => {
  if (isPhrase.value) return results.value
  return results.value.filter((item) => item.group !== "other")
})

const soundAlikeCount = computed(() => {
  if (isPhrase.value) return 0
  return results.value.filter((item) => item.group === "other").length
})

const distinctSurasCount = computed(() => {
  return [
    ...new Set(rootResults.value.flatMap((result) => result.suras || [])),
  ].sort().length
})

const uniqueVersesCount = computed(() => {
  const allVerses = rootResults.value.flatMap((result) => result.verses)

  return new Set(allVerses.map((verse) => verse.verseNumberToQuran)).size
})

const derivedCount = computed(() => rootResults.value.length)

const formattedCounts = computed(() => [
  {
    value: derivedCount.value,
    label: isPhrase.value ? "نتيجة" : "مشتق",
  },
  { value: distinctSurasCount.value, label: "سورة" },
  { value: uniqueVersesCount.value, label: "آية" },
])
</script>
