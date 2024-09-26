<template>
  <v-dialog
    :modelValue="modelValue"
    width="900"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
  >
    <template v-slot:default="{ isActive }">
      <v-sheet rounded="xl">
        <v-container>
          <AppClosingBar @close="handleClose" />
          "{{ searchData.inputText }}"
          <SearchCountHeader
            :wordCount="searchData.wordCount"
            :versesCount="searchData.versesCount"
          />
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

<style lang="scss"></style>
