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
      <AutoWordList
        :key="currentWordsList"
        v-if="showAutoWordsList"
        class="position-absolute w-100"
        :items="currentWordsList"
        :checked-items="checkedItems"
        :height="500"
        @update:currentWordsList="emit('update:items', $event)"
        @update:checked-items="emit('update:checkedItems', $event)"
        @submitTarteel="onTarteelSubmit"
      />
      <AutoVerseList
        :key="currentWordsList"
        v-if="showAutoVerseList"
        class="position-absolute w-100"
        :items="currentWordsList"
        :checked-items="checkedItems"
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
          :class="{
            'opacity-10': showAutoWordsList || showAutoVerseList,
          }"
          :letter="currentLetter"
        />
      </v-lazy>
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
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "update:isLoading",
  "submitTarteel",
  "remove-item",
])

const showAutoWordsList = ref(false)
const showAutoVerseList = ref(false)
const debounceTimer = ref(null)

const onTarteelSubmit = () => {
  emit(
    "submitTarteel",
    props.checkedItems.length > 0
      ? props.checkedItems.value
      : props.currentWordsList
  )
}

const checkTarteelLength = (newValue) => {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  emit("update:isLoading", true)

  debounceTimer.value = setTimeout(() => {
    const updateState = (showWords = false, showVerses = false) => {
      showAutoWordsList.value = showWords
      showAutoVerseList.value = showVerses
      emit("update:menu", true)
      emit("update:isLoading", false)
    }

    if (newValue.length <= 1) return updateState()
    if (newValue.includes(" ")) return updateState(false, true)
    return updateState(true, false)
  }, 300)
}

watch(
  () => props.tarteel,
  (newValue) => {
    checkTarteelLength(newValue)
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
