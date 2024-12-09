<template>
  <v-menu
    :modelValue="menu"
    :close-on-content-click="false"
    :max-height="'auto'"
    width="auto"
    location="bottom"
    activator="parent"
    @update:modelValue="$emit('update:menu', $event)"
  >
    <v-sheet>
      <AutoWordList
        v-if="showAutoWordsList"
        class="w-100"
        :items="currentWordsList"
        :checked-items="checkedItems"
        :height="$vuetify.display.xs ? 300 : 'auto'"
        @update:currentWordsList="emit('update:items', $event)"
        @update:checked-items="emit('update:checkedItems', $event)"
        @submitTarteel="onTarteelSubmit"
      />

      <AutoVerseList
        v-if="showAutoVerseList"
        class="w-100"
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
          v-if="!showAutoVerseList && !showAutoWordsList"
          :letter="currentLetter"
        />
      </v-lazy>
      <AppTarteelBtn
        v-if="showAutoWordsList"
        variant="outlined"
        :checked-items="currentWordsList"
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
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "submitTarteel",
  "remove-item",
])

const showAutoWordsList = ref(false)
const showAutoVerseList = ref(false)

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
