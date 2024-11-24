<template>
  <v-container max-width="1200" class="px-sm-4 px-2">
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
      :title="suraName"
      :inputText="targetTarteel"
      @go-back="handleGoBack"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useRouter } from "vue-router"
import { getMushafChartOptions } from "@/assets/mushafChartOptions"
import { prepareSuraData, prepareMushafData } from "@/utils/suraUtils"

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

const target = computed(() => store.getTarget)
const fileName = computed(() => target.value?.fileName || "001الفاتحة")
const suraNumber = computed(() => parseInt(target.value?.suraNumber))
const suraName = computed(() => target.value?.suraName)
const targetTarteel = computed(() => target.value?.tarteel || "")
const targetVerseIndex = computed(() => target.value?.verseIndex)

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

const setSuraBasics = () => {
  startIndex.value = suraKeyValues.value.verseNumberToQuran - 1
  endIndex.value = suraKeyValues.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  // suraDetails.value = await store.getSuraDetails()
}

const showVerseDetails = computed(() => router.currentRoute.value.query.detail)

const handleVerseSelectedOnTable = (verse) => {
  const query = { ...router.currentRoute.value.query }
  if (query.tarteel) {
    verse.tarteel = query.tarteel
  }

  store.setTarget({
    ...verse,
  })

  router.push({
    path: `/sura/${verse.suraNumber}/${verse.verseIndex}`,
    query: { ...router.currentRoute.value.query, detail: "true" },
  })
}

const handleGoBack = () => {
  const query = { ...router.currentRoute.value.query }
  delete query.detail
  router.push({ query })
}

const isMobileView = computed(() => store.getVersesMobileView)

const tabs = computed(() => [
  { title: "نص", name: "suraText", icon: "mdi-text-box-outline" },
  {
    title: "تفصيل",
    name: "versesTab",
    icon: "mdi-view-list",
  },
  // {
  //   title: "جدول",
  //   name: "versesTab",
  //   icon: "mdi-table",
  // },
  { title: "تواتر", name: "frequency", icon: "mdi-chart-bar" },
])

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
