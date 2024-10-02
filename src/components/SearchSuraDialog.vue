<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    transition="slide-x-transition"
  >
    <template v-slot:default="{ isActive }">
      <v-sheet>
        <AppClosingBar @close="handleClose" />
        <div class="dialog-header">
          <div class="dialog-header-count-chips">
            <AppCountChips :wordCount="searchData.wordCount" :isVerse="false" />
          </div>
          <span>{{ searchData.inputText }}</span>
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
.dialog-sura .sura-title {
  zoom: 0.7;
}
.dialog-header-count-chips {
  display: flex;
  flex-direction: column;
}
</style>
