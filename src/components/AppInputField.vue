<template>
  <v-text-field
    v-model="searchValue"
    :label="`ابحث في ${fieldPlaceHolder}`"
    append-inner-icon="mdi-magnify"
    clearable
    variant="outlined"
    density="compact"
    class="ml-2"
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
  fieldPlaceHolder: {
    type: String,
  },
  fieldInput: String,
  prependIcons: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["update:fieldInput", "iconEvent"])

const searchValue = computed({
  get: () => props.fieldInput,
  set: (value) => emit("update:fieldInput", value),
})

const emitIconEvent = (eventName) => {
  emit("iconEvent", eventName)
}
</script>

<style scoped></style>
