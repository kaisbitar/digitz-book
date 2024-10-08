<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="searchData"
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

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
