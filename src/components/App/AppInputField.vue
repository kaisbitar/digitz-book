<template>
  <div class="input-field-container">
    <v-text-field
      v-bind="$attrs"
      :model-value="modelValue"
      :label="`${fieldPlaceHolder}`"
      :color="hasSuccess ? 'success' : 'primary'"
      :error="hasError"
      density="compact"
      append-inner-icon="mdi-magnify"
      :autofocus="autoFocus"
      hide-details
      @click:clear="handleClear"
      @update:model-value="handleInput"
      @keydown.enter.prevent="$emit('keydown:enter', modelValue)"
      @keydown.backspace="$emit('keydown:backspace')"
      @focus="$emit('focus')"
    >
      <template v-slot:append-inner>
        <slot name="append-inner-input-items"></slot>
      </template>

      <template v-slot:append>
        <slot name="append-input-items"></slot>
      </template>
    </v-text-field>
    <div class="menu-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
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
  hasError: {
    type: Boolean,
    default: false,
  },
  hasSuccess: {
    type: Boolean,
    default: false,
  },
  autoFocus: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  "update:modelValue",
  "clear",
  "focus",
  "keydown:enter",
  "keydown:backspace",
  "close",
])

const handleClear = () => {
  emit("clear")
  emit("update:modelValue", "")
}

const handleInput = (value) => {
  emit("update:modelValue", value)
}
</script>

<style scoped>
.close-btn {
  cursor: pointer;
  margin-right: 8px;
}
</style>
