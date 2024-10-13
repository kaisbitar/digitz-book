<template>
  <v-btn
    @click="toggleInputVisibility"
    :color="isInputVisible ? 'secondary' : 'default'"
  >
    <v-icon class="ml-1">{{
      isInputVisible ? "mdi-close" : "mdi-magnify"
    }}</v-icon>
    <span v-if="!isInputVisible">ابحث في {{ fieldPlaceHolder }}</span>
  </v-btn>

  <AppInputField
    v-if="isInputVisible"
    ref="inputField"
    :fieldInput="fieldInput"
    :fieldPlaceHolder="fieldPlaceHolder"
    :prepend-icons="[{ name: 'mdi-star-shooting', event: 'search' }]"
    @update:fieldInput="$emit('update:fieldInput', $event)"
    autofocus
  />
  <v-spacer></v-spacer>
  <AppFilterActions v-if="showFilterActions" />
</template>

<script setup>
import { ref, watch } from "vue"
const props = defineProps({
  fieldInput: {
    type: [String, null],
    default: "",
  },
  fieldPlaceHolder: {
    type: String,
    required: true,
  },
  showFilterActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["update:fieldInput"])

const isInputVisible = ref(false)
const inputField = ref(null)

const toggleInputVisibility = async () => {
  isInputVisible.value = !isInputVisible.value
}

watch(
  () => props.fieldInput,
  (newValue) => {
    if (newValue !== "") {
      isInputVisible.value = true
    }
  }
)
</script>
