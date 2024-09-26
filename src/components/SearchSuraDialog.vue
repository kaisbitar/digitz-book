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
          <div class="closing-button">
            <v-chip
              variant="flat"
              color="red-darken-4"
              class="text-black font-bold"
              size="x-small"
              @click="
                $emit('update:modelValue', false), (isActive.value = false)
              "
            >
            </v-chip>
          </div>
          <SearchCountHeader
            :searchQuery="searchData.inputText"
            :wordCount="searchData.wordCount"
            :resultsCount="searchData.resultsCount"
          />
          <Sura :suraInputText="searchData.inputText" />
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
  searchData: Object,
  searchIndex: Number,
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
  margin-left: -22px;
  margin-bottom: -26px;
  zoom: 0.7;
}
</style>
