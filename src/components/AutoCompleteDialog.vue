<template>
  <AppDialog :modelValue="modelValue" @update:modelValue="handleClose">
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
