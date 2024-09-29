<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    fullscreen
  >
    <template v-slot:default="{ isActive }">
      <v-sheet>
        <AppClosingBar @close="handleClose" />
        <div class="sura-dialog-header">
          <h1 class="ml-1">{{ searchData.inputText }}</h1>
          <AppCountChips
            :wordCount="searchData.wordCount"
            :versesCount="searchData.versesCount"
          />
        </div>

        <v-container>
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
.sura-dialog-header {
  display: flex;
  align-items: center;
  margin-top: -60px;
  z-index: 852;
  position: relative;
  margin-right: 15px;
  max-width: 80%;
}
</style>
