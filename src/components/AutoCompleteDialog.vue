<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-slot:default="{ isActive }">
      <div class="closing-button">
        <v-btn
          variant="tonal"
          size="small"
          @click="$emit('update:modelValue', false), (isActive.value = false)"
          >X
        </v-btn>
      </div>
      <!-- <template v-for="(component, index) in componentsToRender" :key="index">
        <component :is="component.component" v-bind="component.props" />
      </template> -->
      <AutoComplete />
    </template>
  </v-dialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { watch, onBeforeUnmount } from "vue"
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

onBeforeUnmount(() => {
  store.setIsDialog(false) // Set isDialog to false when component is destroyed
})
</script>

<style lang="scss">
.closing-button {
  width: 44px;
  margin-right: auto;
  z-index: 52;
  margin-left: 6px;
}
</style>
