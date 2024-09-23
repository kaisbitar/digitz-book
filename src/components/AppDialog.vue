<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="1000"
    height="1000"
  >
    <template v-slot:default="{ isActive }">
      <v-sheet class="pa-10 hide-overflow position-relative">
        <v-btn
          icon="mdi-arrow-right"
          size="small"
          class="mt-n10 ml-20"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
        <template v-for="(component, index) in componentsToRender" :key="index">
          <component :is="component.component" v-bind="component.props" />
        </template>
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { watch } from "vue"
const store = useQuranStore()

const props = defineProps({
  modelValue: Boolean,
  componentsToRender: {
    type: Array,
    default: () => [],
  },
})
watch(
  () => props.modelValue,
  (newValue) => {
    store.setIsDialog(newValue)
  }
)

defineEmits(["update:modelValue"])
</script>
