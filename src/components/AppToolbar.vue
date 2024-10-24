<template>
  <v-toolbar density="compact" rounded>
    <AppTabs
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <v-spacer></v-spacer>
    <AppToggleBtn
      :badgeContent="badgeIsActive ? badgeContent : ''"
      class=""
      activeIcon="mdi-close"
      :isActive="isInputVisible"
      :btnText="searchBtnText"
      @toggle="onSearchToggle"
    />
    <v-spacer></v-spacer>
    <slot name="additional-actions"></slot>
  </v-toolbar>

  <AppInputField
    class="flex-grow-1 mt-1"
    v-if="isInputVisible"
    :modelValue="search"
    @update:modelValue="updateSearchValue"
    :fieldPlaceHolder="placeholderText"
    :dataToShow="countBadgeText"
    :type="'verse-count'"
    @clear="onClear"
    @keyup:enter="onEnter"
  />
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
  badgeContent: String,
  badgeIsActive: Boolean,
})

const emit = defineEmits([
  "update:activeTab",
  "update:search",
  "searchToggle",
  "enter",
])

// const onClickOutside = () => {
//   emit("searchToggle", false)
// }

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

const onEnter = () => {
  emit("enter", props.search)
}
</script>
