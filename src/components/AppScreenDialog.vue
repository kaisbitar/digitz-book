<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="1000"
    height="1000"
  >
    <template v-slot:default="{ isActive }">
      <v-sheet class="pa-10 hide-overflow position-relative">
        <v-btn
          icon="mdi-arrow-right"
          size="small"
          class="mt-n10 ml-20"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
        <component :is="componentToRender" v-bind="componentProps" />
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  componentToRender: Object,
  componentProps: Object,
})

defineEmits(["update:modelValue"])
</script>
