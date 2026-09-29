<template>
  <div>
    <div class="d-flex align-center">
      <span class="text-h4 font-weight-bold"
        >{{ selectedTarteel.inputText + "ـ" }}
        <span class="ml-6 text-caption">ومشتقاتها</span>
      </span>
      <v-btn
        icon="mdi-arrow-left"
        variant="tonal"
        size="small"
        class="mr-auto"
        @click="tarteelStore.requestSearchFocus()"
      />
    </div>
    <AppHeaderMetrics :metrics="formattedCounts" />
  </div>
</template>

<script setup>
import { useTarteelStore } from "@/stores/TarteelStore"

const tarteelStore = useTarteelStore()

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

const formattedCounts = computed(() => [
  { value: props.selectedTarteel.results.length, label: "مشتق" },
  { value: distinctSurasCount.value, label: "سورة" },
  { value: uniqueVersesCount.value, label: "آية" },
])
</script>
