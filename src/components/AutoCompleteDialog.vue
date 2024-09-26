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
      <AppClosingBar @close="handleClose" />
      <v-container>
        <AutoComplete />
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

<style lang="scss"></style>
