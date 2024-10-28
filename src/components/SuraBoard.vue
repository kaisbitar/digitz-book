<template>
  <SuraToolbar
    :tabs="tabs"
    :activeTab="activeTab"
    :search="inputText"
    :searchBtnText="searchBtnText"
    :placeholderText="`سورة ${suraName}`"
    :isInputVisible="isInputVisible"
    :badgeIsActive="!!inputText"
    :badgeContent="badgeContent"
    @update:activeTab="updateActiveTab"
    @update:search="onInput"
    @searchToggle="onSearchToggle"
    @enter="onEnter"
  >
    <template #additional-actions>
      <AppFilterActions
        v-if="activeTab === 'versesTab'"
        v-show="$vuetify.display.mdAndUp"
      />
    </template>
  </SuraToolbar>

  <v-window v-model="activeTab">
    <v-window-item value="suraText" @before-enter="scrollToActiveVerse">
      <SuraText
        ref="suraTextRef"
        :inputText="inputText"
        :suraTextArray="suraWithTashkeel"
      />
    </v-window-item>

    <v-window-item value="versesTab" @before-enter="scrollToActiveVerse">
      <VersesOverview
        ref="VersesOverviewRef"
        :verses="versesBasics"
        :versesInputText="inputText"
        @verseSelected="onVerseSelected"
      />
    </v-window-item>

    <v-window-item value="frequency">
      <SuraFrequency
        class="mt-2 mb-n2"
        :chartFreqSeries="chartFreqSeries"
        :chartOptions="chartOptions"
      />
    </v-window-item>
  </v-window>
</template>

<script setup>
import { ref, nextTick, computed } from "vue"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"

const store = useStore()
const props = defineProps({
  tabs: Array,
  suraName: String,
  suraWithTashkeel: Array,
  versesBasics: Array,
  chartFreqSeries: Array,
  chartOptions: Object,
})

const emit = defineEmits([, "verseSelected"])
const searchBtnText = ref(`ترتيل ${props.suraName}`)
const isInputVisible = ref(false)
const filterIndex = ref(0)
const inputText = ref("")

const filteredVerses = computed(() => {
  if (!inputText.value) return []
  return props.versesBasics
    .filter((verse) => verse.verseText.includes(inputText.value))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const badgeContent = computed(() => {
  return filteredVerses.value.length ? `${filteredVerses.value.length}` : ""
})

const targetTarteel = computed(() => store.getTarget?.tarteel)
const tagetedVerseIndex = computed(() => {
  return store.getTarget.verseIndex
})
watch(tagetedVerseIndex, () => {
  scrollToActiveVerse()
})

const onVerseSelected = (verse) => {
  emit("verseSelected", verse)
}

const onSearchToggle = (value) => {
  isInputVisible.value = value
}

const onEnter = (value) => {
  if (value === "") {
    store.setTarget({
      fileName: props.versesBasics[0].fileName,
      verseIndex: props.versesBasics[0].verseIndex || 0,
      verseNumberToQuran: props.versesBasics[0].verseNumberToQuran,
      verseText: props.versesBasics[0].verseText,
    })
    return
  }
}

const onInput = (value) => {
  inputText.value = value
  searchBtnText.value = value || `ترتيل ${props.suraName}`
}

const activeTab = computed({
  get: () => store.getActiveSuraTab,
  set: (value) => store.setActiveSuraTab(value),
})

const suraTextRef = ref(null)
const VersesOverviewRef = ref(null)
const { scrollToActiveItem } = useWindow()

const scrollToActiveVerse = () => {
  nextTick(() => {
    if (activeTab.value === "suraText" && suraTextRef.value) {
      scrollToActiveItem(".active-verse-text", ".sura-text-container")
      return
    }
    VersesOverviewRef.value.tablesScroll()
  })
}

const updateActiveTab = (value) => {
  store.setActiveSuraTab(value)
}

onMounted(() => {
  if (targetTarteel.value) {
    inputText.value = targetTarteel.value
    isInputVisible.value = true
  }
  scrollToActiveVerse()
})
</script>
