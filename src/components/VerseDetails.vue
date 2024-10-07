<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    transition="slide-y-transition"
    :fullscreen="currentBreakpoint === 'mobile'"
    :width="currentBreakpoint === 'mobile' ? '100%' : '70%'"
    max-width="1200"
    height="100%"
  >
    <template #default="{ isActive }">
      <v-sheet>
        <AppClosingBar @close="handleClose" />
        <div class="dialog-header">
          <AppCountChips
            :wordCount="countVerseWords(verse)"
            :letterCount="countVerseLetters(verse)"
            isSura
          />
          <span class="mr-2">{{ title }} : {{ selectedVerseIndex }}</span>
        </div>
        <v-container class="ml-1 pa-9">
          <VerseToolTip :verse="verse" />
        </v-container>

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
import { useWindow } from "@/mixins/window"
const { currentBreakpoint } = useWindow()

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
