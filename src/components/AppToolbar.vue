<template>
  <v-toolbar :density="isInputVisible ? 'default' : 'compact'" rounded>
    <AppTabs
      v-if="!isInputVisible"
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <v-spacer v-if="!isInputVisible"></v-spacer>
    <AppToggleBtn
      :class="isInputVisible ? 'ml-0' : 'ml-4'"
      :isActive="isInputVisible"
      :btnText="searchBtnText"
      @toggle="onSearchToggle"
    />
    <AppInputField
      v-if="isInputVisible"
      v-click-outside="onClickOutside"
      class="mt-5 ml-4"
      :fieldInput="search"
      :fieldPlaceHolder="placeholderText"
      :dataToShow="countBadgeText"
      :type="'verseCount'"
      @update:fieldInput="updateSearchValue"
      @clear="onClear"
      @keyup.enter="onEnter"
    />
    <slot name="additional-actions"></slot>
  </v-toolbar>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  searchBtnText: String,
  placeholderText: String,
  countBadgeText: String,
  isInputVisible: Boolean,
})

const emit = defineEmits([
  "update:activeTab",
  "update:search",
  "searchToggle",
  "enter",
])

const onClickOutside = () => {
  emit("searchToggle", false)
}

const onSearchToggle = () => {
  emit("searchToggle", !props.isInputVisible)
}

const updateSearchValue = (value) => {
  emit("update:search", value)
}

const onClear = () => {
  emit("searchToggle", false)
  emit("update:search", "")
}

const updateActiveTab = (value) => {
  emit("update:activeTab", value)
}

const onEnter = (value) => {
  emit("enter", props.search)
}
</script>
