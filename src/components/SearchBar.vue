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
      clearable
      @update:modelValue="onInput"
      @clear="onClear"
      @keydown:enter="commit"
    />

    <v-snackbar
      v-model="showLangHint"
      location="top"
      :timeout="2500"
      color="warning"
      variant="tonal"
    >
      بدّل لوحة المفاتيح إلى العربية
    </v-snackbar>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue"
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

const { tarteel, currentWordsList, handleInputChange, clearInput } =
  useAutoComplete(dataStore, tarteelStore)

const barRef = ref(null)
const inputHasError = ref(false)
const inputHasSuccess = ref(false)
const showLangHint = ref(false)

const NON_ARABIC = /[^\u0600-\u06FF\u0750-\u077F\s]/g

const onInput = async (value) => {
  const text = value ?? ""
  const cleaned = text.replace(NON_ARABIC, "")
  if (cleaned !== text) {
    showLangHint.value = true
    const input = barRef.value?.querySelector("input")
    if (input) input.value = cleaned
  }

  if (!cleaned.trim()) tarteelStore.discardDraft()

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
const onFocusIn = () => {
  const value = tarteel.value?.trim() || ""
  if (value.length > 1) return
  tarteelStore.setChartVisible(true)
  if (route.name !== "tarteel") router.push({ name: "tarteel" })
}

// Push the current results into the store so the tarteel page renders them
const showLiveResults = () => {
  const value = tarteel.value?.trim() || ""
  if (value.length <= 1) return
  if (currentWordsList.value.length === 0) return

  tarteelStore.setLiveTarteel({
    inputText: value,
    results: [...currentWordsList.value],
    wordRoot: currentWordsList.value.wordRoot ?? null,
  })

  if (route.name !== "tarteel" || route.query.view === "detail") {
    router.push({ name: "tarteel", query: { view: "list" } })
  }
}

const commit = () => {
  tarteelStore.commitDraft()
}

// Leaving the search box (e.g. clicking a result) finalizes the draft
const onFocusOut = (event) => {
  if (barRef.value?.contains(event.relatedTarget)) return
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
  }
)

onMounted(() => {
  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  if (!route.query.focus) return
  barRef.value?.querySelector("input")?.focus()
  router.replace({ query: {} })
})
</script>
