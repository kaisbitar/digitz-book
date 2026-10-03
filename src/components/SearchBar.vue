<template>
  <div ref="barRef" @focusin="onFocusIn" @focusout="onFocusOut">
    <AppInputField
      :modelValue="tarteel"
      fieldPlaceHolder="ابحث في القرآن الكريم..."
      :hasError="inputHasError"
      :hasSuccess="inputHasSuccess"
      :autoFocus="autoFocus"
      lang="ar"
      dir="rtl"
      inputmode="text"
      enterkeyhint="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      rounded="lg"
      variant="outlined"
      base-color="count-key-item"
      @update:modelValue="onInput"
      @clear="onClear"
      @keydown:enter="commit"
    />

    <v-menu
      v-model="showMenu"
      :activator="barRef"
      location="bottom"
      offset="4"
      :open-on-click="false"
      :close-on-content-click="false"
      :width="menuWidth"
    >
      <div class="border rounded bg-surface" @mousedown.prevent>
        <template v-if="isVerseQuery">
          <v-list density="compact" class="py-0">
            <v-list-item>
              <v-checkbox
                v-model="exactVerseMatch"
                label="مطابقة تامة"
                density="compact"
                hide-details
                @click.stop
              />
            </v-list-item>
          </v-list>
          <v-divider />
        </template>
        <v-list
          density="compact"
          class="py-0"
          style="overflow-y: auto; max-height: 280px"
        >
          <v-list-item
            v-for="(item, index) in menuSuggestions"
            :key="`${item.value}-${index}`"
            @click="pickSuggestion(item.value)"
          >
            <v-list-item-title
              class="d-flex align-center justify-space-between"
              style="white-space: normal"
            >
              <span>{{ item.label }}</span>
              <span class="text-caption text-medium-emphasis mr-3">
                {{ item.count }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-menu>

    <v-snackbar
      v-model="showLangHint"
      location="top"
      :timeout="2500"
      color="primary"
      variant="flat"
      rounded="pill"
      min-width="0"
      elevation="1"
    >
      <div class="d-flex align-center">
        <v-icon size="18" class="ml-2">mdi-keyboard-outline</v-icon>
        بدّل لوحة المفاتيح إلى العربية
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"
import AppInputField from "@/components/App/AppInputField.vue"

defineProps({
  autoFocus: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const {
  tarteel,
  currentWordsList,
  menuSuggestions,
  exactVerseMatch,
  handleInputChange,
  searchNow,
  clearInput,
} = useAutoComplete(dataStore, tarteelStore)

const barRef = ref(null)
const inputHasError = ref(false)
const inputHasSuccess = ref(false)
const showLangHint = ref(false)
const isFocused = ref(false)
const suppressMenu = ref(false)
const menuWidth = ref(280)

const isVerseQuery = computed(() => (tarteel.value || "").includes(" "))

watch(exactVerseMatch, async () => {
  const raw = tarteel.value || ""
  if (!raw.includes(" ")) return
  await searchNow(raw)
  showLiveResults()
})

const showMenu = computed({
  get: () =>
    isFocused.value &&
    !suppressMenu.value &&
    (menuSuggestions.value.length > 0 || isVerseQuery.value),
  set: (open) => {
    if (open) return
    suppressMenu.value = true
  },
})

const NON_ARABIC = /[^\u0600-\u06FF\u0750-\u077F\s]/g

const onInput = async (value, keepMenuClosed = false) => {
  suppressMenu.value = keepMenuClosed
  const text = value ?? ""
  const cleaned = text.replace(NON_ARABIC, "")
  if (cleaned !== text) {
    showLangHint.value = true
    const input = barRef.value?.querySelector("input")
    if (input) input.value = cleaned
  }

  if (!cleaned.trim()) {
    tarteelStore.discardDraft()
    clearInput()
    inputHasError.value = false
    inputHasSuccess.value = false
    showLiveLetter()
    showLiveResults()
    return
  }

  const hasResults = await handleInputChange(cleaned)
  inputHasSuccess.value = hasResults
  inputHasError.value = !hasResults
  showLiveLetter()
  showLiveResults()
}

// A single letter shows the letters chart on the tarteel page
const showLiveLetter = () => {
  const value = tarteel.value?.trim() || ""
  tarteelStore.setLiveLetter(value.length === 1 ? value : null)
  tarteelStore.setChartVisible(value.length <= 1)
  if (value.length > 1) return
  if (route.name !== "tarteel") router.push({ name: "tarteel" })
}

// Focusing the box (empty or one letter) shows the chart and history
const pickSuggestion = (value) => {
  const input = barRef.value?.querySelector("input")
  if (input) input.value = value
  onInput(value, true)
}

const onFocusIn = () => {
  isFocused.value = true
  suppressMenu.value = false
  menuWidth.value = barRef.value?.offsetWidth || 280
  const value = tarteel.value?.trim() || ""
  if (value.length > 1) return
  tarteelStore.setChartVisible(true)
  if (route.name !== "tarteel") router.push({ name: "tarteel" })
}

// Push the current results into the store so the tarteel page renders them
const showLiveResults = () => {
  const raw = tarteel.value || ""
  const value = raw.trim()
  if (value.length <= 1) return
  if (currentWordsList.value.length === 0 && !raw.includes(" ")) return

  tarteelStore.setLiveTarteel({
    inputText: raw.endsWith(" ") ? `${value} ` : value,
    results: [...currentWordsList.value],
    wordRoot: currentWordsList.value.wordRoot ?? null,
  })

  if (route.name !== "tarteel" || route.query.view === "detail") {
    router.push({ name: "tarteel", query: { view: "list" } })
  }
}

const commit = async () => {
  suppressMenu.value = true
  const raw = tarteel.value || ""
  const value = raw.trim()

  if (value.length > 1) {
    await searchNow(raw)
    showLiveResults()
    tarteelStore.setLiveLetter(null)
    tarteelStore.setChartVisible(false)
  }

  const onSearchPage =
    route.name === "tarteel" && route.query.view !== "detail"
  if (!onSearchPage) {
    router.push({ name: "tarteel", query: { view: "list" } })
  }

  tarteelStore.commitDraft()
}

// Leaving the search box (e.g. clicking a result) finalizes the draft
const onFocusOut = (event) => {
  if (barRef.value?.contains(event.relatedTarget)) return
  isFocused.value = false
  tarteelStore.setChartVisible(false)
  if (!tarteel.value) return
  commit()
}

const onClear = () => {
  tarteelStore.discardDraft()
  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(true)
  clearInput()
  inputHasError.value = false
  inputHasSuccess.value = false
}

// Back buttons on the results pages ask for the search box to be focused
watch(
  () => tarteelStore.searchFocusTick,
  async () => {
    // Keep the search that was on screen in history, then start fresh
    tarteelStore.commitDraft()
    clearInput()
    inputHasError.value = false
    inputHasSuccess.value = false
    tarteelStore.setLiveLetter(null)
    tarteelStore.setChartVisible(true)
    await nextTick()
    barRef.value?.querySelector("input")?.focus()
  },
)

onMounted(() => {
  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  if (!route.query.focus) return
  barRef.value?.querySelector("input")?.focus()
  router.replace({ query: {} })
})
</script>
