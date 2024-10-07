<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    transition="slide-y-transition"
    :fullscreen="currentBreakpoint === 'mobile'"
    :width="currentBreakpoint === 'mobile' ? '100%' : '70%'"
    max-width="1200"
    height="100%"
  >
    <template v-slot:default="{ isActive }">
      <v-sheet>
        <AppClosingBar @close="handleClose" />
        <div class="dialog-header">
          <AppCountChips
            :wordCount="searchData.wordCount"
            :versesCount="searchData.versesCount"
          />
          <span class="mr-2">{{ searchData.inputText }}</span>
        </div>

        <v-container class="dialog-sura">
          <Sura :suraInputText="searchData.inputText" />
        </v-container>
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import Sura from "@/pages/Sura.vue"
import { useWindow } from "@/mixins/window"
const { currentBreakpoint } = useWindow()

const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  searchData: Object,
})

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss">
.dialog-header-count-chips {
  display: flex;
  align-items: center;
}
</style>
