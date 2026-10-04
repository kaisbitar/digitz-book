<template>
  <v-card
    elevation="0"
    class="d-flex SuraInputField bg-background flex-grow-0 flex-shrink-0"
  >
    <div class="py-1" style="width: 280px; max-width: 100%">
      <AppInputField
        v-model="localSearch"
        :fieldPlaceHolder="placeholderText"
        :hasError="hasError"
        :hasSuccess="hasSuccess"
        variant="outlined"
        @update:modelValue="onInput"
        @keydown:enter="onEnter"
      >
        <template v-slot:append-inner-input-items>
          <span v-if="inputIndex > 0">
            {{ badgeContent }}/{{ inputIndex }}
          </span>
        </template>
        <template v-slot:append-input-items>
          <v-btn
            v-for="btn in inputNavigation"
            :key="btn.icon"
            :class="[btn.class]"
            :icon="btn.icon"
            :tabindex="btn.tabindex"
            variant="tonal"
            size="small"
            clickable
            @click="btn.action"
          ></v-btn>
        </template>
      </AppInputField>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue"

const props = defineProps({
  search: String,
  placeholderText: String,
  badgeContent: String,
  inputIndex: Number,
})

const emit = defineEmits([
  "update:search",
  "enter",
  "navigate-up",
  "navigate-down",
])

const localSearch = ref(props.search || "")
const hasError = ref(false)
const hasSuccess = ref(false)

watch(
  () => props.search,
  (newValue) => {
    localSearch.value = newValue
  },
)

const onInput = async (value) => {
  localSearch.value = value
  emit("update:search", value)

  if (!value.trim()) {
    hasError.value = false
    hasSuccess.value = false
    return
  }

  nextTick(() => {
    if (parseInt(props.badgeContent) > 0) {
      hasError.value = false
      hasSuccess.value = true
      return
    }
    hasError.value = true
    hasSuccess.value = false
  })
}

const onEnter = () => {
  emit("enter", localSearch.value)
}

const handleClickUp = () => {
  emit("navigate-up")
}

const handleClickDown = () => {
  emit("navigate-down")
}

const inputNavigation = computed(() => [
  {
    icon: "mdi-chevron-up",
    class: "ml-1",
    tabindex: -1,
    action: handleClickUp,
  },
  {
    icon: "mdi-chevron-down",
    class: "ml-1",
    tabindex: -1,
    action: handleClickDown,
  },
])
</script>

<style scoped></style>
