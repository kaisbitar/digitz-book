<template>
  <v-list-item class="position-sticky menu-header" style="top: 0; z-index: 2">
    <div class="d-flex align-center">
      <AppTarteelBtn
        v-if="showAutoWordsList"
        :all-items="currentWordsList"
        :checked-items="checkedItems"
        @submit="$emit('submitTarteel')"
      />

      <span class="text-caption mr-4">البحث:</span>
      <v-chip
        :text="currentWordsList.word || tarteel"
        color="primary"
        variant="tonal"
        size="default"
        class="font-weight-bold mr-1"
      />
      <div v-if="currentWordsList.wordRoot" class="d-flex align-center mt-1">
        <span class="text-caption mr-4">الجذر:</span>
        <v-chip
          :text="currentWordsList.wordRoot"
          color="secondary"
          variant="tonal"
          size="default"
          class="font-weight-bold mr-1"
        />
      </div>

      <div class="align-center d-none d-lg-flex">
        <v-chip
          :text="`${totalWordsCount} كلمة`"
          color="primary"
          variant="tonal"
          size="default"
          class="font-weight-bold ml-4 mr-4"
        />
      </div>
      <v-checkbox
        v-model="includeTashkeel"
        label="تشكيل"
        hide-details
        density="default"
        color="primary"
        class="mr-auto ml-4"
        @update:modelValue="handleTashkeelChange"
      />
    </div>
    <div v-if="hasSuggestions" class="mt-4 pt-4">
      <div class="d-flex align-center mb-3">
        <v-icon size="small" color="warning" class="mr-2">
          mdi-lightbulb-outline
        </v-icon>
        <span class="text-caption font-weight-bold text-medium-emphasis">
          اقتراحات:
        </span>
      </div>
      <v-chip
        v-for="(suggestion, index) in suggestions"
        :key="index"
        :text="suggestion"
        variant="outlined"
        size="small"
        color="primary"
        class="cursor-pointer ml-2"
        @click="applySuggestion(suggestion)"
      />
    </div>
  </v-list-item>
</template>

<script setup>
import { ref, watch } from "vue"
import AppTarteelBtn from "./App/AppTarteelBtn.vue"

const props = defineProps({
  showAutoWordsList: {
    type: Boolean,
    required: true,
  },
  currentWordsList: {
    type: Array,
    required: true,
  },
  checkedItems: {
    type: Array,
    required: true,
  },
  tarteel: {
    type: String,
    required: true,
  },
  totalWordsCount: {
    type: Number,
    required: true,
  },
  hasSuggestions: {
    type: Boolean,
    required: true,
  },
  suggestions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  "submitTarteel",
  "update:tashkeel",
  "applySuggestion",
])

const includeTashkeel = ref(false)

const handleTashkeelChange = () => {
  emit("update:tashkeel", includeTashkeel.value)
}

const applySuggestion = (suggestion) => {
  emit("applySuggestion", suggestion)
}
</script>

<style scoped>
.menu-header {
  background: rgb(var(--v-theme-surface));
}
</style>
