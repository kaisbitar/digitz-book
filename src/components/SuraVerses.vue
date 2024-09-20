<template>
    <div class="dashVerses d-flex">
      <v-card class="webKitWidth" flat>
        <tableVerses
          :tableData="props.versesBasics"
          :tableVersesHeaders="tableVersesHeaders"
          :inputText="inputText"
          :targetVerseNumberToQuran="targetVerseNumberToQuran"
          :groupBy="null"
          :dataType="inputText"
          @activateItem="setTargetedSuraAndVerse"
          @rowClicked="handleVerseClick"
          @activateRowItem="goToVerseTextView"
        />
      </v-card>
    </div>
  </template>


<script setup>
import { ref, computed, watch, defineProps } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const router = useRouter()
const quranStore = useQuranStore()

const props = defineProps(['versesBasics', 'isLoading', 'inputText'])

const tableVersesHeaders = ref([
  // { title: 'INDEX', key: '', class: 'brown-lighten-5 black--text', width: '100' },
  {
    title: 'السورة',
    key: 'fileName',
    class: 'brown lighten-5 black--text',
    width: '110',
    filterable: false,
  },
  { title: 'رقم', key: 'verseIndex', class: 'brown lighten-5 black--text', width: '80' },
  { title: 'الآية', key: 'verseText', class: 'brown lighten-5 black--text' },
  { title: 'كلمات', key: 'numberOfWords', class: 'brown lighten-5 black--text', width: '85' },
  { title: 'حروف', key: 'numberOfLetters', class: 'brown lighten-5 black--text', width: '85' },
  { title: 'مصحف', key: 'verseNumberToQuran', class: 'brown lighten-5 black--text', width: '90' },
])

const verseChart = ref([])
const verseIndex = ref('')
const verseNumberToQuran = ref(1)
const numberOfLetters = ref(0)
const numberOfWords = ref(0)
const verseText = ref('')

const store = useQuranStore()

const targetFileName = computed(() => store.getTarget?.fileName)
const targetVerseNumberToQuran = computed(() => store.getTarget?.verseNumberToQuran)

const handleVerseClick = item => {
  if (!item) return
  verseIndex.value = item.verseIndex
  verseNumberToQuran.value = item.verseNumberToQuran
  numberOfLetters.value = item.verseText.replace(/ /g, '').length.toString()
  numberOfWords.value = item.verseText.split(' ').length.toString()
  verseText.value = item.verseText
  setTargetedSuraAndVerse(item)
  if (targetFileName.value === '000المصحف') return
  perpareChartData(item)
}

const setTargetedSuraAndVerse = item => {
  if (targetFileName.value === '000المصحف') {
    const target = {
      fileName: '000المصحف',
      verseIndex: item.verseIndex,
      verseNumberToQuran: item.verseNumberToQuran,
    }
    store.setTarget(target)
    return
  }
  const suraNumber = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
  const suraName = item.fileName.replace(/[0-9]/g, '')
  store.setTarget({
    fileName: `${suraNumber}${suraName}`,
    verseIndex: item.verseIndex,
    verseNumberToQuran: item.verseNumberToQuran,
  })
}

const goToVerseTextView = value => {
  // store.setActiveView('textView')
  store.setActiveTab('suraText')
  setTargetedSuraAndVerse(value)
}

const perpareChartData = item => {
  const chart = item.verseText.split(' ').map(word => word.length)
  verseChart.value = [{ data: chart }]
}
</script>
