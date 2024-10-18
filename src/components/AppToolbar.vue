<template>
  <v-toolbar density="compact" rounded>
    <AppTabs
      v-if="!isInputVisible"
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <v-spacer v-if="!isInputVisible"></v-spacer>
    <AppToggleBtn
      :isActive="isInputVisible"
      :btnText="searchBtnText"
      @toggle="onSearchToggle"
    />
    <AppInputField
      v-if="isInputVisible"
      v-click-outside="onClickOutside"
      :fieldInput="search"
      :fieldPlaceHolder="placeholderText"
      :dataToShow="filteredDataLength"
      @update:fieldInput="updateSearchValue"
      @clear="onClear"
    />
    <slot name="additional-actions"></slot>
  </v-toolbar>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  searchBtnText: String,
  placeholderText: String,
  filteredDataLength: Number,
})

const emit = defineEmits(["update:activeTab", "update:search", "searchToggle"])

const isInputVisible = ref(false)

const onClickOutside = () => {
  isInputVisible.value = false
}

const onSearchToggle = () => {
  isInputVisible.value = !isInputVisible.value
  emit("searchToggle", isInputVisible.value)
}

const updateSearchValue = (value) => {
  emit("update:search", value)
}

const onClear = () => {
  isInputVisible.value = false
  emit("update:search", "")
}

const updateActiveTab = (value) => {
  emit("update:activeTab", value)
}
</script>
