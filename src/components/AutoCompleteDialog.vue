<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
    transition="fab"
    fullscreen
    :overlay="false"
  >
    <template v-slot:default="{ isActive }">
      <AppClosingBar @close="handleClose" />
      <v-container class="mb-2 auto-complete-container">
        <AutoComplete
          v-click-outside="handleClose"
          class="auto-complete-dialog"
        />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean,
})

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss">
.auto-complete-container {
  padding: 52px;
  padding-right: 15px;
  margin-top: -52px;
}
</style>
