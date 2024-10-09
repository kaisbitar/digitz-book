<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="closingBarData"
  >
    <v-container class="dialog-sura">
      <Sura :suraInputText="searchData.inputText" />
    </v-container>
  </AppDialog>
</template>
<script setup>
import Sura from "@/pages/Sura.vue"

const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  searchData: Object,
})

const closingBarData = computed(() => ({
  wordCount: props.searchData.wordCount,
  versesCount: props.searchData.versesCount,
  inputText: props.searchData.inputText,
  labels: { word: "مرة", verse: "آية" },
}))

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
