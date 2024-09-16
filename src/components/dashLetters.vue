<template>
  <div>
    <v-tabs v-model="tab" bg-color="mt-0 pr-1 pl-2" centered>
      <v-tab value="tab-1" class="dash-tabs">بيان</v-tab>
      <v-tab value="tab-2" class="dash-tabs">جدول</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <div class="webKitWidth">
          <appChart
            class="mr-1 pa-0 ml-2 webKitWidth lettersChart"
            :dataType="'letters'"
            :series="series"
            :isLoading="isLoading"
            :options="options"
            :includeTab="true"
            v-if="showChart"
            :height="getHeight()"
          />
        </div>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <div class="d-flex s">
          <v-card outlined>
            <tableOccurrences
              :tableData="occurrences"
              :dataType="dataType"
              :tableHeaders="tableHeaders"
              :search="search"
              :footerProps="footerProps"
              :isLoading="isLoading"
              :groupBy="null"
              :includeTab="true"
              @rowClicked="setDetailItem"
            />
          </v-card>
          <dashLabelsPositions
            :detailElement="detailElement"
            :detailCount="detailCount"
            :detailsData="indexes"
            :isLoading="isLoading"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import DashLabelsPositions from './dashLabelsPositions.vue'
import AppChart from './appChart.vue'
import chartOptions from '../assets/numbersOptions.js'
import TableOccurrences from './tableOccurrences.vue'
import { useDetailMixin } from '../mixins/detailMixin'

const { detailElement, detailCount, setDetailItem } = useDetailMixin()

const display = useDisplay()

const tab = ref('tab-1')
const dataType = ref('letters')
const options = ref(chartOptions)
const tableHeaders = ref([{ title: 'الحروف', key: 'x', class: ' lighten-4 black--text' }])
const indexes = ref({})
const wordsGroup = ref(null)
const alfhaBet = ref([
  'ب',
  'ت',
  'ث',
  'ج',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ك',
  'ل',
  'م',
  'ن',
  'ه',
  'و',
  'ي',
  'ؤ',
  'ء',
  'ى',
  'ة',
  'أ',
  'آ',
  'إ',
  'ا',
])
const occurrences = ref([])
const showChart = ref(true)
const isLoading = ref(false)
const search = ref('')
const footerProps = ref({})
const suraText = ref('')

const setToolTip = () => {
  const x = {
    custom: obj => {
      return (
        '<div class="d-flex pt-2 pa-2">' +
        '<div class=" tipInfo "><span class="tipLabel">الحرف:</span> ' +
        obj.w.globals.seriesX[0][obj.dataPointIndex] +
        '</div>' +
        '<div class="  tipInfo tipInfo2"><span class="tipLabel">تكرار:</span> ' +
        obj.series[0][obj.dataPointIndex] +
        '</div>' +
        '</div>'
      )
    },
    shared: true,
    followCursor: true,
  }
  options.value = {
    ...options.value,
    ...{ tooltip: x },
  }
}

const getHeight = () => {
  return display.height.value - 290
}

const getIndexes = () => {
  const obj = {}
  alfhaBet.value.forEach(letter => {
    obj[letter] = []
    for (let i = 0; i < suraText.value.length; i++) {
      if (suraText.value[i] === letter) {
        obj[letter].push(i + 1)
      }
    }
  })
  indexes.value = obj
}

const getOccurrences = () => {
  occurrences.value = Object.entries(indexes.value).map(([key, value]) => ({
    x: key,
    y: value.length,
  }))
  occurrences.value.sort((a, b) => a.y - b.y)
}

const series = computed(() => {
  if (!occurrences.value) return []
  return [{ data: occurrences.value }]
})

watch(
  () => suraText.value,
  () => {
    if (!suraText.value) return
    getIndexes()
    getOccurrences()
  },
)

onMounted(() => {
  setToolTip()
  getIndexes()
  getOccurrences()
})
</script>

<style>
.showIcon {
  position: absolute;
  z-index: 2;
  margin-right: 16px;
  margin-top: 24px;
  cursor: pointer;
}
/* .tableStyle .tableItem.text-right {
  background: #f2f2f233;
}
.tableStyle .tableItem.text-right {
  background: #f2f2f233;
} */
.dashSearchField {
  width: 150px;
  margin-bottom: -22px;
  z-index: 3;
  position: relative;
  padding-left: 0px !important;
}
</style>
