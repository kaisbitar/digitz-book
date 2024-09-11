<template>
  <div class="text-center">
    <div class="d-flex searchWrap mr-1">
      <v-text-field
        v-model="search"
        background-color="white"
        append-icon="mdi-magnify"
        label="سورة أو رقماً فيها.."
        clear-icon="mdi-close"
        class="mr-2 ml-2 mt-3"
        single-line
        clearable
        outlined
        dense
      ></v-text-field>
      <div class="mt-5">
        <v-icon
          :color="showDetail === false ? 'grey' : 'blue'"
          @click=";(showDetail = !showDetail), $emit('showDetailToggle', showDetail)"
        >
          mdi-format-horizontal-align-center
        </v-icon>
      </div>
    </div>
    <div id="indexBlock">
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        loading-text="جاري تحميل أسماء السور"
        :search="search"
        :items-per-page="115"
        :height="'84vh'"
        fixed-header
        hide-default-footer
        class="tableStyle indexStyle"
        id="indexBlock"
      >
        <template v-slot:item="props">
          <tr
            @click="runSura(props.item)"
            :class="{ activeTableItem: props.item.fileName === fileName }"
            class="tableItem"
          >
            <td class="text-right" v-html="highlight(suraIndex(props.item.fileName), search)"></td>
            <td class="text-right" v-html="highlight(suraName(props.item.fileName), search)"></td>
            <td class="text-right" v-html="highlight(props.item.numberOfVerses, search)"></td>
            <td class="text-right" v-html="highlight(props.item.numberOfWords, search)"></td>
            <td class="text-right" v-html="highlight(props.item.numberOfLetters, search)"></td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onCreated } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const store = useQuranStore()
const router = useRouter()

// Reactive state
const loading = ref(true)
const search = ref('')
const showDetail = ref(false)

// Data that doesn't need to be reactive
const headers = [
  { text: 'رقم', value: 'suraIndex', width: 70 },
  { text: 'السورة', value: 'fileName', width: 100 },
  { text: 'الآيات', value: 'numberOfVerses', width: 90 },
  { text: 'كلمات', value: 'numberOfWords', width: 90 },
  { text: 'حروف', value: 'numberOfLetters', width: 90 },
]

// Computed properties
const data = computed(() => store.getTableQuranIndex)
const fileName = computed(() => store.getTarget.fileName)

// Methods
const suraName = fileName => fileName.replace(/[0-9]/g, '')

const suraIndex = fileName => {
  if (fileName === '000المصحف') return '0'
  return parseInt(fileName, 10)
}

const runSura = sura => {
  store.setTarget({
    fileName: sura.fileName,
    verseIndex: null,
  })
  if (router.currentRoute.value.name !== 'singleSura') {
    router.push({ name: 'singleSura' })
  }
  store.setSearchIndex(-1)
}

const scrollToIndex = () => {
  setTimeout(() => {
    vuetify.goTo('.activeTableItem', {
      container: '.v-data-table__wrapper',
    })
  }, 10)
}

const highlight = (text, search) => {
  if (!text) return
  if (search == null) return text
  text = text.toString()
  const query = new RegExp(search, 'gi')
  return text.replace(query, match => {
    return '<span class="yellow accent-1">' + match + '</span>'
  })
}

// Watchers
watch(fileName, () => {
  scrollToIndex()
})

watch(search, newValue => {
  if (newValue === null) {
    showDetail.value = false
    emit('showDetailToggle', showDetail.value)
    return
  }
  if (!isNaN(newValue)) {
    showDetail.value = true
    emit('showDetailToggle', showDetail.value)
  }
})

// Lifecycle hooks
onCreated(() => {
  if (!fileName.value) {
    loading.value = false
    return
  }
  scrollToIndex()
  loading.value = false
})

// Emits
const emit = defineEmits(['showDetailToggle'])
</script>

<style>
th {
  padding-top: 2px !important;
  height: 25px !important;
}
.indexStyle .tableItem {
  font-weight: 100;
}
.tableItem {
  cursor: pointer;
  font-weight: 500;
  color: #544d4d;
  font-size: 16px !important;
}
.tableItem:hover {
  background: #0000000f !important;
  opacity: 0.7;
}
.activeTableItem,
.activeTableItem2 {
  color: black !important;
  font-weight: 500 !important;
  background: #efebe9 !important;
}
.tableStyle td {
  border: none !important;
}
.tableStyle table {
  border-collapse: collapse;
  width: 100%;
}
.tableStyle tr:nth-child(even) {
  background-color: #f9f9f980;
}
.indexStyle {
  width: auto !important;
}
.searchBox {
  padding-bottom: 0px;
  margin-bottom: -21px;
}
#indexBlock .v-data-table--fixed-header > .v-data-table__wrapper {
  overflow-x: hidden !important;
  /* margin-left: -11px; */
}
.searchWrap {
  width: 220px;
  height: 66px;
}
.v-text-field__slot {
  position: initial;
}
label.v-label.theme--light {
  font-size: 14px;
  top: 10px;
}
</style>
