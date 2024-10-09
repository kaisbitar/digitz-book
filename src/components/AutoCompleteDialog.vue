<template>
  <AppDialog :modelValue="modelValue" transition="fab">
    <AutoComplete v-click-outside="handleClose" class="auto-complete-dialog" />
  </AppDialog>
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
