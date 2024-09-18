<template>
  <div class="text-center">
    <div class="d-flex searchWrap mr-1">
      <appSearchBox
        @searchChanged="changeSearch"
        @matchChanged="changeMatchingStatus"
        :inputText="search"
        :dataType="'السور'"
      />
      <!-- <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        label="سورة أو رقماً فيها.."
        clearable
        class="mr-2 ml-2 mt-3"
        single-line
        variant="outlined"
        density="compact"
      ></v-text-field>
      <div class="mt-5">
        <v-icon :color="showDetail ? 'blue' : 'grey'" @click="toggleShowDetail">
          mdi-format-horizontal-align-center
        </v-icon>
      </div> -->
    </div>
    <div id="indexBlock">
      <v-data-table
        :items="data"
        :headers="headers"
        :loading="loading"
        loading-text="جاري تحميل أسماء السور"
        :search="search"
        :items-per-page="115"
        :height="'85vh'"
        fixed-header
        hide-default-footer
        class="tableStyle indexStyle"
        id="indexBlock"
      >
        <template v-slot:item="props">
          <tr
            @click="runSura(props.item)"
            :class="{ activeSuraItem: props.item.fileName === fileName }"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useGoTo } from 'vuetify'
import { useTableOcc } from '../mixins/tableOccMixin'

const store = useQuranStore()
const router = useRouter()
const goTo = useGoTo() // Add this line
const { highlight, changeSearch, changeMatchingStatus } = useTableOcc()
// Reactive state
const loading = ref(true)
const search = ref('')
const showDetail = ref(false)

// Data that doesn't need to be reactive
const headers = [
  { title: 'رقم', key: 'suraIndex', width: 70 },
  { title: 'السورة', key: 'fileName', width: 100 },
  { title: 'الآيات', key: 'numberOfVerses', width: 90 },
  { title: 'كلمات', key: 'numberOfWords', width: 90 },
  { title: 'حروف', key: 'numberOfLetters', width: 90 },
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
    verseIndex: 1,
    verseNumberToQuran: sura.verseNumberToQuran.toString(),
  })
  if (router.currentRoute.value.name !== 'singleSura') {
    router.push({ name: 'singleSura' })
  }
  store.setSearchIndex(-1)
}

const scrollToIndex = () => {
  // setTimeout(() => {
  goTo('activeSuraItem', {
    container: 'v-table__wrapper',
  })
  // }, 10)
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
onMounted(() => {
  if (!fileName.value) {
    loading.value = false
    return
  }
  scrollToIndex()
  loading.value = false
})

// Emits
const emit = defineEmits(['showDetailToggle'])

const toggleShowDetail = () => {
  showDetail.value = !showDetail.value
  emit('showDetailToggle', showDetail.value)
}
</script>

<style>
.indexStyle {
  width: auto !important;
}

.searchBox {
  padding-bottom: 0px;
  margin-bottom: -21px;
}

.searchWrap {
  width: 220px;
  height: 66px;
}

.v-text-field__slot {
  position: initial;
}

/* Update label color for both themes */
label.v-label {
  font-size: 14px;
  top: 10px;
  color: rgb(var(--v-theme-text-color));
}

.tableItem:hover {
  background: rgba(var(--v-theme-hover-color), var(--v-hover-opacity)) !important;
  opacity: 0.7;
}

#indexBlock .v-table--fixed-header > .v-table__wrapper {
  overflow-x: hidden !important;
  margin-left: -11px;
}
</style>
