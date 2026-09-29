<template>
  <v-dialog
    :modelValue="menu"
    fullscreen
    transition="dialog-bottom-transition"
    @update:modelValue="emit('update:menu', $event)"
    @after-enter="focusInput"
  >
    <v-card ref="cardRef" class="d-flex flex-column" height="100%">
      <v-toolbar density="comfortable" color="surface" class="border-b flex-grow-0">
        <v-btn icon="mdi-close" @click="emit('update:menu', false)" />
        <v-container max-width="900" class="py-0">
          <AppInputField
            :modelValue="tarteel"
            :fieldPlaceHolder="placeholder"
            :hasError="hasError"
            :hasSuccess="hasSuccess"
            :loading="isLoading"
            :autoFocus="true"
            rounded="lg"
            variant="outlined"
            base-color="count-key-item"
            clearable
            @update:modelValue="emit('update:tarteel', $event)"
            @clear="emit('clear')"
            @keydown:enter="emit('submitTarteel')"
          />
        </v-container>
      </v-toolbar>

      <v-card-text class="flex-grow-1 overflow-y-auto pa-0">
        <v-container max-width="900">
          <AutoMenuHeader
            v-if="showAutoWordsList || showAutoVerseList"
            :is-verse-mode="showAutoVerseList"
            :current-words-list="currentWordsList"
            :checked-items="checkedItems"
            :tarteel="tarteel"
            :total-words-count="totalWordsCount"
            :has-suggestions="hasSuggestions"
            :suggestions="suggestions"
            @submit-tarteel="emit('submitTarteel')"
            @update:tashkeel="handleTashkeelChange"
            @apply-suggestion="applySuggestion"
          />

          <AutoWordList
            v-if="showAutoWordsList"
            :items="currentWordsList"
            :checked-items="checkedItems"
            @update:currentWordsList="emit('update:items', $event)"
            @update:checked-items="emit('update:checkedItems', $event)"
            @submitTarteel="onTarteelSubmit"
          />

          <AutoVerseList
            v-if="showAutoVerseList"
            :items="currentWordsList"
            :checked-items="checkedItems"
            @update:currentWordsList="emit('update:items', $event)"
            @update:checked-items="emit('update:checkedItems', $event)"
            @submitTarteel="onTarteelSubmit"
          />

          <LettersChart
            v-if="!showAutoVerseList && !showAutoWordsList && showLetterChart"
            class="opacity-transition"
            :letter="currentLetter"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import AutoMenuHeader from "./AutoMenuHeader.vue"
import AppInputField from "./App/AppInputField.vue"

const props = defineProps({
  menu: Boolean,
  tarteel: String,
  placeholder: {
    type: String,
    default: "ابحث في القرآن الكريم...",
  },
  hasError: Boolean,
  hasSuccess: Boolean,
  isLoading: Boolean,
  currentWordsList: Array,
  totalWordsCount: Number,
  currentLetter: String,
  checkedItems: Array,
  suggestions: Array,
  hasSuggestions: Boolean,
  showLetterChart: Boolean,
  context: {
    type: String,
    default: "nav", // 'nav' or 'home'
    validator: (value) => ["nav", "home"].includes(value),
  },
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "submitTarteel",
  "remove-item",
  "update:tashkeel",
  "update:tarteel",
  "clear",
])

const cardRef = ref(null)
const showAutoWordsList = ref(false)
const showAutoVerseList = ref(false)
const includeTashkeel = ref(false)

const focusInput = () => {
  const input = cardRef.value?.$el?.querySelector("input")
  if (!input) return
  input.focus({ preventScroll: true })
}

const onTarteelSubmit = () => {
  emit(
    "submitTarteel",
    props.checkedItems.length > 0
      ? props.checkedItems.value
      : props.currentWordsList
  )
}

const setMenuState = (newValue) => {
  const updateState = (showWords = false, showVerses = false) => {
    showAutoWordsList.value = showWords
    showAutoVerseList.value = showVerses
  }

  if (!newValue || newValue.length <= 1) return updateState()
  if (newValue.includes(" ")) return updateState(false, true)

  return updateState(true, false)
}

const handleTashkeelChange = (value) => {
  includeTashkeel.value = value
  emit("update:tashkeel", value)
}

const applySuggestion = (suggestion) => {
  emit("update:tarteel", suggestion)
}

watch(
  () => props.tarteel,
  (newValue) => {
    setMenuState(newValue)
  },
  { immediate: true }
)
</script>

<style scoped>
.opacity-transition {
  transition: opacity 0.3s ease;
}
</style>
