<template>
  <template class="d-flex flex-column h-100 pa-0 pt-4 px-4">
    <SuraBoard
      v-if="!showVerseDetails"
      :tabs="tabs"
      :suraName="suraName"
      :suraWithTashkeel="suraWithTashkeel"
      :versesBasics="versesBasics"
      :chartFreqSeries="chartFreqSeries"
      @verseSelected="handleVerseSelectedOnTable"
    />

    <VerseDetails
      v-if="showVerseDetails"
      :verse="targetedVerseText"
      :title="suraName"
      :inputText="targetTarteel"
      @go-back="showVerseDetails = !showVerseDetails"
    />
  </template>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useRouter } from "vue-router"
import { getMushafChartOptions } from "@/assets/mushafChartOptions"
import { prepareSuraData, prepareMushafData } from "@/utils/suraUtils"
import SuraBoard from "@/components/SuraBoard.vue"

const router = useRouter()
const props = defineProps(["suraInputText"])
const store = useStore()
const dataStore = useDataStore()

const suraWithTashkeel = ref([])
const startIndex = ref(null)
const endIndex = ref(null)
const suraTextArray = ref([])
const versesBasics = ref([])
const letterSeries = ref([{ data: [] }])
const versesSeries = ref([{ data: [] }])
const wordsSeries = ref([{ data: [] }])
const suraDetails = ref({})
const showVerseDetails = ref(false)

const fileName = computed(() => store.getTarget?.fileName || "001الفاتحة")
const suraNumber = computed(() => parseInt(store.getTarget?.suraNumber))
const suraName = computed(() => store.getTarget?.suraName)
const targetedVerseText = computed(() => store.getTarget)
const targetTarteel = computed(() => store.getTarget?.tarteel || "")

const tableQuranIndex = computed(() => dataStore.getQuranIndex)
const suraKeyValues = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1]
)
const mushafChartOptions = computed(() =>
  getMushafChartOptions(tableQuranIndex.value.length)
)
const chartFreqType = computed(() => store.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === "words" ? wordsSeries.value : letterSeries.value
)

const oneQuranFile = computed(() => dataStore.getOneQuranFile)
const allVersesWithTashkeel = computed(() => dataStore.getAllVersesWithTashkeel)

const handleVerseSelectedOnTable = (verse) => {
  showVerseDetails.value = true
}

const setSuraBasics = () => {
  startIndex.value = suraKeyValues.value.verseNumberToQuran - 1
  endIndex.value = suraKeyValues.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  // suraDetails.value = await store.getSuraDetails()
}

const prepareData = () => {
  setSuraBasics()
  fetchSuraDetails()
  if (fileName.value === "000المصحف") {
    prepareMushafData({
      oneQuranFile,
      versesBasics,
      suraTextArray,
      letterSeries,
      versesSeries,
      wordsSeries,
      tableQuranIndex,
    })
    suraWithTashkeel.value = allVersesWithTashkeel.value
    return
  }
  prepareSuraData({
    oneQuranFile,
    startIndex,
    endIndex,
    versesBasics,
    suraTextArray,
    letterSeries,
    wordsSeries,
  })
  suraWithTashkeel.value = allVersesWithTashkeel.value.slice(
    startIndex.value,
    endIndex.value
  )
}

const goBack = () => {
  router.back()
}

const isMobileView = computed(() => store.getVersesMobileView)

const tabs = computed(() => [
  { title: "نص", name: "suraText", icon: "mdi-text-box-outline" },
  {
    title: "تفصيل",
    name: "versesTab",
    icon: isMobileView.value ? "mdi-format-list-bulleted" : "mdi-view-list",
  },
  { title: "تواتر", name: "frequency", icon: "mdi-chart-bar" },
])

watch(fileName, prepareData)

onMounted(() => {
  store.setActiveRoute("sura")
  prepareData()
})
</script>

<style lang="scss">
.back-btn .v-badge {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
