<template>
  <v-dialog
    :modelValue="modelValue"
    width="900"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
  >
    <template v-slot:default="{ isActive }">
      <div class="closing-button">
        <v-btn
          variant="tonal"
          size="small"
          @click="$emit('update:modelValue', false), (isActive.value = false)"
          >X
        </v-btn>
      </div>
      <v-sheet>
        <v-container>
          <SearchChipsGroup
            :chipsData="[inputText]"
            :deletable="false"
            :selectedChipIndex="0"
          />
          <Sura :suraInputText="inputText" />
        </v-container>
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { watch, onBeforeUnmount } from "vue"
import Sura from "@/pages/Sura.vue"

const store = useQuranStore()
const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  inputText: String,
})

const handleClose = () => {
  emit("update:modelValue", false)
  store.setIsDialog(false)
}

watch(
  () => props.modelValue,
  (newValue) => {
    store.setIsDialog(newValue)
  }
)

onBeforeUnmount(() => {
  store.setIsDialog(false) // Set isDialog to false when component is destroyed
})
</script>

<style lang="scss">
.closing-button {
  width: 44px;
  margin-right: auto;
  z-index: 52;
  margin-left: 6px;
}
</style>
