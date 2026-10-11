<template>
  <div class="d-flex align-center flex-wrap ga-2">
    <div>
      <span class="header-title text-h4 ml-4">{{ headerTitle }}</span>
      <AppHeaderMetrics :metrics="formattedCounts" />
    </div>
    <slot />
  </div>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"

const { calculateValue } = useCounting()

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

const derivedCount = computed(() => rootResults.value.length)

const totalVerses = computed(() =>
  rootResults.value.reduce((sum, item) => sum + (item.verses?.length || 0), 0),
)

const totalCount = computed(() =>
  rootResults.value.reduce((sum, item) => sum + (item.count || 0), 0),
)

const totalSuras = computed(() => {
  const suras = new Set(
    rootResults.value.flatMap((item) => item.suras || []),
  )
  return suras.size
})

const numeralValue = computed(() =>
  calculateValue((props.selectedTarteel.inputText || "").trim()),
)

const formattedCounts = computed(() => [
  {
    value: derivedCount.value,
    label: isPhrase.value ? "نتيجة" : "مشتق",
  },
  {
    value: totalVerses.value,
    label: "آية",
  },
  {
    value: totalCount.value,
    label: "مرة",
  },
  {
    value: totalSuras.value,
    label: "سورة",
  },
  {
    value: numeralValue.value,
    label: "مرقوم",
  },
])
</script>
