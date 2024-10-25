<template>
  <v-scale-transition>
    <v-card
      v-if="isInputVisible"
      :key="isInputVisible"
      class="d-flex mr-auto mb-1 position-sticky mt-md-n11 mt-n3 z-1"
      width="300"
      variant="text"
    >
      <AppInputField
        class="flex-grow-1"
        v-model="localSearch"
        @update:modelValue="onInput"
        :fieldPlaceHolder="placeholderText"
        :type="'verse-count'"
        @clear="onClear"
        @keydown.enter="onEnter"
        :style="{ maxWidth: '190px' }"
      />
      <AppToggleBtn
        class="mt-3 mr-1"
        :isActive="true"
        activeIcon="mdi-arrow-up"
      />
      <AppToggleBtn class="mt-3" :isActive="true" activeIcon="mdi-arrow-down" />
    </v-card>
  </v-scale-transition>

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
import { ref, watch } from "vue"

const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  searchBtnText: String,
  placeholderText: String,
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

const localSearch = ref(props.search || "")

watch(
  () => props.search,
  (newValue) => {
    localSearch.value = newValue
  }
)

const onSearchToggle = () => {
  emit("searchToggle", !props.isInputVisible)
}

const onInput = (value) => {
  localSearch.value = value
  emit("update:search", value)
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
</script>

<style scoped></style>
