<template>
  <div class="toolbar-container">
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

    <AppInputField
      v-if="isInputVisible"
      v-model="localSearch"
      :type="'verse-count'"
      :fieldPlaceHolder="placeholderText"
      class="mt-1"
      @update:modelValue="onInput"
      @keydown.enter="onEnter"
    >
      <template v-slot:append-input-items>
        <!-- <span style="width: 50px"> -->
        {{ badgeContent }}/{{ currentIndex + 1 }}
        <!-- </span> -->
        <v-divider vertical class="mr-2"></v-divider>
        <AppToggleBtn
          class="mr-1"
          :isActive="true"
          activeIcon="mdi-chevron-up"
          size="default"
          @click="handleClickUp"
        />
        <AppToggleBtn
          :isActive="true"
          activeIcon="mdi-chevron-down"
          size="default"
          @click="handleClickDown"
        />
        <AppToggleBtn
          :isActive="true"
          activeIcon="mdi-close"
          size="default"
          @click="onClear"
        />
      </template>
    </AppInputField>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import { useDisplay } from "vuetify"

const display = useDisplay()

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

const handleClickUp = () => {
  emit("navigate-up")
}

const handleClickDown = () => {
  emit("navigate-down")
}
</script>

<style scoped>
.toolbar-container {
  position: sticky;
  top: 0;
  z-index: 4;
}
</style>
