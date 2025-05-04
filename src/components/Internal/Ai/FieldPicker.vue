<template>
  <v-select
    v-if="fields.length"
    v-model="selected"
    :items="fields"
    label="Select a field"
    @update:model-value="emitField"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue"

const props = defineProps({
  jsonData: {
    type: [Object, Array],
    required: true,
  },
})

const emit = defineEmits(["select"])
const selected = ref(null)

const fields = computed(() => {
  if (!props.jsonData) return []
  if (Array.isArray(props.jsonData) && props.jsonData.length > 0) {
    return Object.keys(props.jsonData[0])
  }
  if (props.jsonData.distinctWords) {
    const firstItem = Object.values(props.jsonData.distinctWords)[0]
    return firstItem ? Object.keys(firstItem) : []
  }
  return Object.keys(props.jsonData)
})

const emitField = (field) => {
  emit("select", field)
}

watch(fields, (newFields) => {
  if (newFields.length && !selected.value) {
    selected.value = newFields[0]
    emitField(selected.value)
  }
})
</script>
