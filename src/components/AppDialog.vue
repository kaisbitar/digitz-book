<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    :transition="transition ? transition : 'slide-x-transition'"
    :fullscreen="currentBreakpoint === 'mobile'"
    :width="currentBreakpoint === 'mobile' ? '100%' : '70%'"
    max-width="1200"
    height="100%"
    :overlay="false"
  >
    <template #default="{ isActive }">
      <v-sheet>
        <AppDialogClosingBar
          @close="handleClose"
          :closingBarData="closingBarData"
        />
        <slot></slot>
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { useWindow } from "@/mixins/window"
const { currentBreakpoint } = useWindow()

const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  closingBarData: Object,
  transition: String,
})

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
