<template>
  <div class="dashVerses d-flex">
    <v-card class="webKitWidth" flat v-show="!showSingleVerse">
      <tableVerses
        :tableData="versesBasics"
        :tableHeaders="tableHeaders"
        :inputText="inputText"
        :menuItems="menuItems"
        :activeTableItemId="verseNumberToQuran"
        :isLoading="isLoading"
        :groupBy="null"
        :dataType="' عن آية أو رقم'"
        @rowClicked="handleVerseSelection"
        @handleClickedMenu="runMenuItem"
        @activateRowItem="goToverseTextView"
      />
    </v-card>
    <tableDialogEdit
      v-if="showEditVerse"
      @close="showEditVerse = false"
      :suraName="suraNumber + suraName"
      :verseIndex="verseIndex"
      :verseText="verseText"
      :showEditVerse="showEditVerse"
    />
    <div class="pt-5 webKitWidth" outlined v-if="showSingleVerse">
      <dashSingleVerse
        v-if="showSingleVerse"
        :verseIndex="verseIndex"
        @backBtnClicked="showSingleVerse = !showSingleVerse"
        :verseNumberToQuran="verseNumberToQuran"
        :numberOfLetters="numberOfLetters"
        :numberOfWords="numberOfWords"
        :verseText="verseText"
        :inputText="inputText"
        :secondInput="secondInput"
        :suraName="suraName"
        :isLoading="isLoading"
        :verseChart="verseChart"
        :options="options"
        :height="singleVerseHeight"
        :wordIndexes="wordIndexes"
      />
      <v-overlay color="white" :absolute="true" :opacity="0.8" :value="isLoading"> </v-overlay>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue'
import { useQuranStore } from '@/stores/app'
import chartOptions from '../assets/frequecyOptions'
import tableVerses from './tableVerses.vue'
import dashSingleVerse from './dashSingleVerse'
import tableDialogEdit from './tableDialogEdit.vue'

// Change this line
const props = defineProps(['versesBasics', 'isLoading', 'inputText'])
console.log(props.versesBasics)
const index = ref(1)
const tableHeaders = ref([
  { text: 'INDEX', value: '', class: 'brown lighten-5 black--text', width: '100' },
  {
    text: 'السورة',
    value: 'fileName',
    class: 'brown lighten-5 black--text',
    width: '110',
    filterable: false,
  },
  { text: 'رقم', value: 'verseIndex', class: 'brown lighten-5 black--text', width: '80' },
  { text: 'الآية', value: 'verseText', class: 'brown lighten-5 black--text' },
  { text: 'كلمات', value: 'numberOfWords', class: 'brown lighten-5 black--text', width: '85' },
  { text: 'حروف', value: 'numberOfLetters', class: 'brown lighten-5 black--text', width: '85' },
  { text: 'مصحف', value: 'verseNumberToQuran', class: 'brown lighten-5 black--text', width: '90' },
])
const menuItems = ref([
  { title: 'تفصيل ', instuction: 'showSingleVerse' },
  { title: 'تحرير ', instuction: 'showEditVerse' },
  { title: 'إلغاء', instuction: 'cancel' },
])
const verseChart = ref([])
const verseIndex = ref('')
const verseNumberToQuran = ref('')
const numberOfLetters = ref('')
const numberOfWords = ref('')
const verseText = ref('')
const suraName = ref('')
const options = ref(chartOptions)
const windowHeight = ref(window.innerHeight)
const wordIndexes = ref({})
const secondInput = ref('')
const showEditVerse = ref(false)
const showSingleVerse = ref(false)

const store = useQuranStore()

const singleVerseHeight = computed(() => windowHeight.value - 420)

const targetFileName = computed(() => store.getTarget?.fileName)

const targetVerseIndex = computed(() => store.getTarget?.verseIndex)

const handleVerseSelection = item => {
  if (!item) return
  verseIndex.value = item.verseIndex
  verseNumberToQuran.value = item.verseNumberToQuran
  numberOfLetters.value = item.verseText.replace(/ /g, '').length.toString()
  numberOfWords.value = item.verseText.split(' ').length.toString()
  verseText.value = item.verseText
  getOneVerseWordIndexes(item.verseText)
  setTargetedSuraAndVerse(item)
  if (targetFileName.value === '000المصحف') return
  perpareChartData(item)
}

const getOneVerseWordIndexes = text => {
  wordIndexes.value = {}
  text.split(' ').forEach((word, index) => {
    if (!wordIndexes.value[word]) {
      wordIndexes.value[word] = [index + 1]
      return
    }
    wordIndexes.value[word].push(index + 1)
  })
}

const runMenuItem = item => {
  if (item === 'showSingleVerse') {
    showSingleVerse.value = true
    return
  }
  if (item === 'showEditVerse') showEditVerse.value = true
}

const setTargetedSuraAndVerse = item => {
  suraName.value = item.fileName.replace(/[0-9]/g, '')
  suraNumber.value = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
  if (targetFileName.value === '000المصحف') {
    const target = { fileName: '000المصحف', verseIndex: item.verseNumberToQuran }
    store.setTarget(target)
    return
  }
  store.setTarget({
    fileName: `${suraNumber.value}${suraName.value}`,
    verseIndex: item.verseIndex,
  })
}

const goToverseTextView = () => {
  store.setActiveView('textView')
  checkAndGo('singleSura')
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}

const perpareChartData = item => {
  const chart = item.verseText.split(' ').map(word => word.length)
  verseChart.value = [{ data: chart }]
}

const setChartToolTip = () => {
  options.value = {
    ...options.value,
    tooltip: {
      custom: obj => {
        return (
          '<div class= d-flex pt-2 pa-2">' +
          '<div class=" tipInfo tipInfo2 ">' +
          verseText.value.split(' ')[obj.dataPointIndex] +
          '</div>' +
          '<div class=" tipInfo ">' +
          obj.series[0][obj.dataPointIndex] +
          '<span class="tipLabel"> حروف</span></div>' +
          '</div>'
        )
      },
      shared: true,
      followCursor: true,
    },
  }
}

const setChartXaxis = () => {
  options.value = {
    ...options.value,
    xaxis: {
      labels: { show: true },
      title: {
        offsetY: 0,
        text: 'تواتر الكلمات',
        style: {
          fontSize: '12px',
        },
      },
      axisTicks: {
        show: true,
        maxTicksLimit: 1,
        interval: 1,
      },
      tickAmount: 1,
      tickPlacement: 'between',
    },
  }
}

const setChartSingleVerse = () => {
  options.value = {
    ...options.value,
    chart: {
      offsetY: 10,
      type: 'area',
      toolbar: {
        show: false,
      },
      events: {
        mouseMove: (event, chartContext, config) => {
          secondInput.value = verseText.value.split(' ')[config.dataPointIndex]
        },
      },
    },
  }
}

const setChartDataLabels = () => {
  options.value = {
    ...options.value,
    dataLabels: {
      enabled: true,
      offsetY: 0,
      background: {
        enabled: false,
      },
    },
  }
}

watch(showSingleVerse, newValue => {
  if (newValue) {
    setChartToolTip()
    setChartSingleVerse()
    setChartDataLabels()
    setChartXaxis()
  }
})

watch(
  () => store.getTarget?.fileName,
  () => {
    showSingleVerse.value = false
  },
)
</script>

<style>
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
.dashTabs {
  height: 35px;
  letter-spacing: 0px;
}
.v-slide-group__content.v-tabs-bar__content {
  height: 35px;
}
</style>
