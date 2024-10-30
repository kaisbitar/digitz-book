<template>
  <AppInputField
    v-if="isInputVisible"
    v-model="localSearch"
    :fieldPlaceHolder="placeholderText"
    class="mt-1"
    :hasError="hasError"
    :hasSuccess="hasSuccess"
    @update:modelValue="onInput"
    @keydown.enter="onEnter"
  >
    <template v-slot:append-input-items>
      <span class="ml-4 mt-2 text-caption">
        {{ badgeContent }}/{{ currentIndex + 1 }}
      </span>
      <v-divider vertical class="ml-2"></v-divider>
      <v-btn
        icon="mdi-chevron-up"
        elevation="0"
        clickable
        size="small"
        tabindex="-1"
        @click="handleClickUp"
      ></v-btn>
      <v-btn
        icon="mdi-chevron-down"
        elevation="0"
        clickable
        size="small"
        tabindex="-1"
        @click="handleClickDown"
      ></v-btn>
      <v-btn
        icon="mdi-close"
        elevation="0"
        clickable
        size="small"
        @click="onClear"
      ></v-btn>
    </template>
  </AppInputField>
  <v-toolbar density="compact" rounded elevation="2" class="toolbar-fixed">
    <AppTabs
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <v-spacer></v-spacer>
    <AppToggleBtn
      :badgeContent="badgeIsActive ? badgeContent : ''"
      class=""
      activeIcon="mdi-file-search-outline"
      :isActive="isInputVisible"
      :btnText="searchBtnText"
      @toggle="onSearchToggle"
    />
    <v-spacer></v-spacer>
    <slot name="additional-actions"></slot>
  </v-toolbar>
</template>

<script setup>
import { ref, watch, computed } from "vue"

const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  searchBtnText: String,
  placeholderText: String,
  isInputVisible: Boolean,
  badgeContent: String,
  badgeIsActive: Boolean,
  currentIndex: Number,
})

const emit = defineEmits([
  "update:activeTab",
  "update:search",
  "searchToggle",
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
  }
)

const onSearchToggle = () => {
  emit("searchToggle", !props.isInputVisible)
}

const onInput = async (value) => {
  localSearch.value = value
  hasError.value = false
  hasSuccess.value = false
  emit("update:search", value)
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

const onClear = () => {
  localSearch.value = ""
  emit("searchToggle", false)
  emit("update:search", "")
}

const updateActiveTab = (value) => {
  emit("update:activeTab", value)
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
</script>

<style scoped></style>
