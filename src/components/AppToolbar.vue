<template>
  <v-toolbar :density="isInputVisible ? 'default' : 'compact'" rounded>
    <AppTabs
      v-if="!isInputVisible"
      :tabs="tabs"
      :activeTab="activeTab"
      @update:activeTab="updateActiveTab"
    />
    <v-spacer v-if="!isInputVisible"></v-spacer>
    <v-spacer></v-spacer>
    <div :class="isInputVisible ? 'w-100 d-flex' : ''">
      <AppToggleBtn
        :badgeContent="!isInputVisible && badgeIsActive ? badgeContent : ''"
        :class="isInputVisible ? 'ml-0 mt-6' : ''"
        :showText="!isInputVisible"
        :isActive="isInputVisible"
        :btnText="searchBtnText"
        @toggle="onSearchToggle"
      />
      <AppInputField
        class="flex-grow-1"
        v-if="isInputVisible"
        v-click-outside="onClickOutside"
        :modelValue="search"
        @update:modelValue="updateSearchValue"
        :fieldPlaceHolder="placeholderText"
        :dataToShow="countBadgeText"
        :type="'verse-count'"
        @clear="onClear"
        @keyup:enter="onEnter"
      />
    </div>
    <v-spacer></v-spacer>

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
  badgeContent: String,
  badgeIsActive: Boolean,
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

const onEnter = () => {
  emit("enter", props.search)
}
</script>
