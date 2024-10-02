<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    transition="slide-x-transition"
  >
    <template #default="{ isActive }">
      <v-sheet>
        <AppClosingBar @close="handleClose" />
        <div class="dialog-header">
          <h1 class="ml-1">{{ title }}: {{ selectedVerseIndex }}</h1>
        </div>
        <v-container class="ml-1"><VerseToolTip :verse="verse" /></v-container>
        <AppCountChips
          :wordCount="countVerseWords(verse)"
          :letterCount="countVerseLetters(verse)"
          isVerse
        />
        <SuraFrequency
          :chartFreqSeries="[{ data: verseLengths }]"
          :chartOptions="chartOptions"
          :height="chartWindowHeight"
        />
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import chartOptionsConfig from "@/assets/frequecyOptions"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const emit = defineEmits(["update:modelValue"])
const { countVerseWords, countVerseLetters } = useCounting()

const props = defineProps({
  modelValue: Boolean,
  verse: String,
  title: String,
})

const chartOptions = ref(chartOptionsConfig)

const selectedVerseIndex = computed(() => store.getTarget.verseIndex)
const chartWindowHeight = computed(() => window.innerHeight - 260)
const verseLengths = computed(() =>
  props.verse.split(" ").map((word) => word.length)
)

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss">
.v-container.v-locale--is-rtl.verse-details {
  background: rgb(var(--v-theme-surface));
}
</style>
