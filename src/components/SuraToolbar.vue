<template>
  <AppInputField
    v-if="isInputVisible"
    class="sura-input-field mt-2"
    v-model="localSearch"
    :fieldPlaceHolder="placeholderText"
    :hasError="hasError"
    :hasSuccess="hasSuccess"
    @update:modelValue="onInput"
    @keydown:enter="onEnter"
  >
    <template v-slot:append-input-items>
      <span v-if="inputIndex > 0" class="ml-4">
        {{ badgeContent }}/{{ inputIndex }}
      </span>
      <v-divider class="ml-2"></v-divider>
      <v-btn
        class="mt-n4"
        v-for="btn in inputNavigation"
        :key="btn.icon"
        :class="btn.class"
        :icon="btn.icon"
        variant="tonal"
        size="small"
        clickable
        :tabindex="btn.tabindex"
        @click="btn.action"
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
import { useRouter } from "vue-router"
const props = defineProps({
  tabs: Array,
  activeTab: String,
  search: String,
  searchBtnText: String,
  placeholderText: String,
  isInputVisible: Boolean,
  badgeContent: String,
  badgeIsActive: Boolean,
  inputIndex: Number,
})

const emit = defineEmits([
  "update:activeTab",
  "update:search",
  "searchToggle",
  "enter",
  "navigate-up",
  "navigate-down",
])

const router = useRouter()

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

const goBack = () => {
  router.back()
}

const inputNavigation = [
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
  {
    icon: "mdi-close",
    class: "ml-1",
    action: onClear,
  },
  {
    icon: "mdi-arrow-left",
    class: "mx-0",
    action: goBack,
  },
]
</script>

<style>
.sura-input-field .v-input__control {
  height: 43px !important;
}
</style>
