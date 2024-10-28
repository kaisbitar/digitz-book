<template>
  <div class="toolbar-container">
    <v-scale-transition>
      <v-card
        v-if="isInputVisible"
        :key="isInputVisible"
        class="d-flex"
        :width="isMobile ? 'auto' : '300'"
        variant="text"
      >
        <AppInputField
          class="flex-grow-1 mb-1"
          v-model="localSearch"
          @update:modelValue="onInput"
          :fieldPlaceHolder="placeholderText"
          :type="'verse-count'"
          @clear="onClear"
          @keydown.enter="onEnter"
        />
        <AppToggleBtn
          class="mt-2 mr-1"
          :isActive="true"
          activeIcon="mdi-chevron-up"
        />
        <AppToggleBtn
          class="mt-2"
          :isActive="true"
          activeIcon="mdi-chevron-down"
        />
      </v-card>
    </v-scale-transition>

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

const isMobile = computed(() => {
  return display.xs.value
})

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

<style scoped>
.toolbar-container {
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: rgb(var(--v-theme-background));
}

.toolbar-fixed {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
