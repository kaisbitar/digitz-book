<template>
  <div>
    <v-badge
      :content="dataToShow"
      :color="type"
      floating
      offset-x="5"
      offset-y="10"
    ></v-badge>
    <v-text-field
      :model-value="modelValue"
      v-bind="$attrs"
      :label="`ترتيل ${fieldPlaceHolder}`"
      append-inner-icon="mdi-magnify"
      density="compact"
      clearable
      autofocus
      @click:clear="handleClear"
      prepend-inner-icon="mdi-magnify"
      hide-details
      class="flex-grow-1"
      @update:model-value="handleInput"
      @focus="$emit('focus')"
    >
    </v-text-field>
    <slot></slot>
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
})

const emit = defineEmits(["update:modelValue", "clear", "focus"])

const theme = useTheme()

const handleClear = () => {
  emit("clear")
  emit("update:modelValue", "")
}

const handleInput = (value) => {
  emit("update:modelValue", value)
}
</script>
