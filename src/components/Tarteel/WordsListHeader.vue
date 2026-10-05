<template>
  <div class="d-flex align-center flex-wrap ga-2">
    <div>
      <span class="header-title text-h4 ml-4" @click="emit('closeVerses')">
        {{ headerTitle }}
      </span>
      <AppHeaderMetrics
        :metrics="formattedCounts"
        @click="emit('closeVerses')"
      />
    </div>
    <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(["closeVerses"])

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

const formattedCounts = computed(() => [
  {
    value: derivedCount.value,
    label: isPhrase.value ? "نتيجة" : "مشتق",
  },
])
</script>
