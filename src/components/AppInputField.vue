<template>
  <div class="input-field-container">
    <v-text-field
      v-bind="$attrs"
      class="flex-grow-1"
      :model-value="modelValue"
      :label="`ترتيل ${fieldPlaceHolder}`"
      :color="hasSuccess ? 'success' : 'primary'"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      density="compact"
      prepend-inner-icon="mdi-magnify"
      autofocus
      hide-details
      variant="underlined"
      @click:clear="handleClear"
      @update:model-value="handleInput"
      @focus="$emit('focus')"
    >
      <template v-slot:append-inner>
        <slot name="append-input-items"></slot>
      </template>
    </v-text-field>
    <div class="menu-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from "vuetify"

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  fieldPlaceHolder: {
    type: String,
    required: true,
  },
  dataToShow: {
    type: [Number, String],
    default: "",
  },
  type: {
    type: String,
    default: "primary",
  },
  errorMessage: {
    type: String,
    default: "",
  },
  hasSuccess: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  "update:modelValue",
  "clear",
  "focus",
  "keydown:enter",
])

const theme = useTheme()

const handleClear = () => {
  emit("clear")
  emit("update:modelValue", "")
}

const handleInput = (value) => {
  emit("update:modelValue", value)
}
</script>

<style scoped></style>
