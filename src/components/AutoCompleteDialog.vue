<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    width="700"
    class="auto-complete-dialog"
    height="900"
    :transition="'fade'"
  >
    <template v-slot:default="{ isActive }">
      <v-container>
        <div class="closing-button-autocomplete">
          <v-chip
            variant="flat"
            color="red-darken-4"
            class="text-black font-bold"
            size="x-small"
            @click="$emit('update:modelValue', false), (isActive.value = false)"
          >
          </v-chip>
        </div>
        <AutoComplete />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { watch, onBeforeUnmount } from "vue"

const store = useQuranStore()

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean,
})

const handleClose = () => {
  emit("update:modelValue", false)
  store.setIsDialog(false)
}

watch(
  () => props.modelValue,
  (newValue) => {
    store.setIsDialog(newValue)
  }
)

onBeforeUnmount(() => {
  store.setIsDialog(false) // Set isDialog to false when component is destroyed
})
</script>

<style lang="scss">
.closing-button-autocomplete {
  width: 44px;
  margin-right: auto;
  z-index: 52;
  margin-left: -27px;
  zoom: 0.7;
}
</style>
