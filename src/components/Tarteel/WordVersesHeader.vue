<template>
  <div class="d-flex mb-4">
    <v-btn
      v-if="!isWordMeaningOpen"
      icon="mdi-pencil-outline"
      variant="tonal"
      size="small"
      class="ml-auto d-block"
      @click="$emit('update:isUserNoteOpen', true)"
    />
    <div>
      <span class="text-h4 ml-4">{{ word }}</span>
      <AppHeaderMetrics :metrics="counts" />
    </div>

    <v-btn
      icon="mdi-arrow-left"
      variant="tonal"
      size="small"
      class="mr-auto d-block"
      @click="goBack"
    />

    <v-btn
      v-if="isWordMeaningOpen"
      icon="mdi-close"
      variant="tonal"
      size="small"
      class="mr-auto"
      @click="$emit('update:isWordMeaningOpen', false)"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useCounting } from "@/mixins/counting"
import { useTarteelStore } from "@/stores/TarteelStore"

const router = useRouter()

const { calculateValue } = useCounting()
const tarteelStore = useTarteelStore()

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  versesCount: {
    type: Number,
    required: true,
  },
  occurrenceCount: {
    type: Number,
    required: true,
  },
  isWordMeaningOpen: {
    type: Boolean,
    required: true,
  },
})

const display = useDisplay()
const selectedTarteel = computed(() => {
  return tarteelStore.getStoredTarteels.find(
    (tarteel) => tarteel.id === tarteelStore.getSelectedTarteelId
  )
})
const counts = computed(() => {
  const allCounts = [
    { value: props.versesCount, label: "آية" },
    { value: props.occurrenceCount, label: "مرة" },
    { value: calculateValue(props.word), label: "مرقوم" },
  ]

  return display.xs.value ? [allCounts[0]] : allCounts
})

// Several words: back to the word list. One word: back to the chart.
const goBack = () => {
  if (selectedTarteel.value?.results?.length > 1) {
    router.push({ name: "tarteel", query: { view: "list" } })
    return
  }
  router.push({ name: "tarteel" })
}

defineEmits([
  "update:expanded",
  "update:isWordMeaningOpen",
  "update:isUserNoteOpen",
])
</script>
