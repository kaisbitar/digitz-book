<template>
  <v-text-field
    v-model="searchValue"
    :label="`ابحث في ${dataType}`"
    append-inner-icon="mdi-magnify"
    clearable
    variant="outlined"
    density="compact"
  >
    <template #prepend-inner>
      <v-icon
        v-for="(icon, index) in prependIcons"
        :key="index"
        :icon="icon.name"
        size="x-small"
        @click="emitIconEvent(icon.event)"
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { computed, watch, onMounted } from "vue"

const props = defineProps({
  dataType: {
    type: String,
    // required: true,
  },
  inputText: String,
  prependIcons: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["update:inputText", "iconEvent"])

const searchValue = computed({
  get: () => props.inputText,
  set: (value) => emit("update:inputText", value),
})

watch(
  () => props.inputText,
  (newValue) => {
    // console.log('newValue', newValue)
  }
)

const emitIconEvent = (eventName) => {
  emit("iconEvent", eventName)
}
</script>

<style scoped></style>
