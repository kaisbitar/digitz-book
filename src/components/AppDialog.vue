<template>
  <v-dialog activator="parent" width="900">
    <template v-slot:default="{ isActive }">
      <v-sheet class="" rounded position="relative">
        <div>
          <v-btn
            icon="mdi-close"
            size="small"
            class=""
            @click="$emit('update:modelValue', false), (isActive.value = false)"
          ></v-btn>
        </div>
        <!-- <v-container class="mt-n15 pl-5 pr-5"> -->
        <template v-for="(component, index) in componentsToRender" :key="index">
          <component :is="component.component" v-bind="component.props" />
        </template>
        <!-- </v-container> -->
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { watch } from "vue"
const store = useQuranStore()

const props = defineProps({
  modelValue: Boolean,
  componentsToRender: {
    type: Array,
    default: () => [],
  },
})
watch(
  () => props.modelValue,
  (newValue) => {
    store.setIsDialog(newValue)
  }
)

defineEmits(["update:modelValue"])
</script>

<style lang="scss">
// .v-dialog .v-row .v-row--no-gutters {
//   margin-top: -96px;
//   margin-right: 31px;
// }
</style>
