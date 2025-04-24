<template>
  <v-menu
    :modelValue="menu"
    :close-on-content-click="false"
    :max-height="'auto'"
    location="bottom"
    activator="parent"
    @update:modelValue="$emit('update:menu', $event)"
  >
    <v-sheet>
      <v-list-item v-if="showAutoWordsList">
        <div class="d-flex align-center">
          <v-checkbox
            v-model="includeTashkeel"
            label="تشكيل"
            hide-details
            class="mr-2"
            @update:modelValue="handleTashkeelChange"
          />
        </div>
        <v-divider class="mt-2"></v-divider>
        <div v-if="hasSuggestions" class="suggestions-list">
          <v-chip
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="ma-1"
            variant="outlined"
            @click="applySuggestion(suggestion)"
          >
            {{ suggestion }}
          </v-chip>
        </div>
      </v-list-item>

      <AutoWordList2
        v-if="showAutoWordsList"
        :items="currentWordsList"
        :checked-items="checkedItems"
        :height="$vuetify.display.xs ? 300 : '250'"
        @update:currentWordsList="emit('update:items', $event)"
        @update:checked-items="emit('update:checkedItems', $event)"
        @submitTarteel="onTarteelSubmit"
      />
      <!-- <AutoWordList
        v-if="showAutoWordsList"
        :items="currentWordsList"
        :checked-items="checkedItems"
        :height="$vuetify.display.xs ? 300 : '250'"
        @update:currentWordsList="emit('update:items', $event)"
        @update:checked-items="emit('update:checkedItems', $event)"
        @submitTarteel="onTarteelSubmit"
      /> -->

      <AutoVerseList
        v-if="showAutoVerseList"
        :items="currentWordsList"
        :checked-items="checkedItems"
        :height="$vuetify.display.xs ? 350 : 330"
        @update:currentWordsList="emit('update:items', $event)"
        @update:checked-items="emit('update:checkedItems', $event)"
        @submitTarteel="onTarteelSubmit"
      />
      <v-lazy
        :options="{
          threshold: 0.5,
        }"
      >
        <LettersChart
          class="opacity-transition"
          v-if="!showAutoVerseList && !showAutoWordsList && showLetterChart"
          :letter="currentLetter"
        />
      </v-lazy>
      <AppTarteelBtn
        v-if="showAutoWordsList"
        variant="outlined"
        :all-items="currentWordsList"
        :checked-items="checkedItems"
        @submit="emit('submitTarteel')"
      />
      <AppTarteelBtn
        v-if="showAutoVerseList"
        variant="outlined"
        :checked-items="currentWordsList[0]?.verses"
        :btn-text="`آية`"
        :badge-type="'verse-count'"
        :is-disabled="currentWordsList.length === 0"
        @submit="emit('submitTarteel')"
      />
    </v-sheet>
  </v-menu>
</template>

<script setup>
import { ref, watch, computed } from "vue"

const props = defineProps({
  menu: Boolean,
  tarteel: String,
  currentWordsList: Array,
  totalWordsCount: Number,
  currentLetter: String,
  checkedItems: Array,
  suggestions: Array,
  hasSuggestions: Boolean,
  showLetterChart: Boolean,
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "submitTarteel",
  "remove-item",
  "update:tashkeel",
  "update:tarteel",
])

const showAutoWordsList = ref(false)
const showAutoVerseList = ref(false)
const includeTashkeel = ref(false)

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

  if (newValue.length <= 1) return updateState()
  if (newValue.includes(" ")) return updateState(false, true)

  return updateState(true, false)
}

const handleTashkeelChange = () => {
  emit("update:tashkeel", includeTashkeel.value)
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

onMounted(() => {})
</script>

<style scoped>
.opacity-transition {
  transition: opacity 0.3s ease;
}
</style>
