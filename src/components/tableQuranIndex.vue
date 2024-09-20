<template>
  <appSearchBox :inputText="search" :dataType="'السور'" />
  <v-toolbar density="compact" color="surface">
    <v-btn
      :icon="showDetail ? 'mdi-format-horizontal-align-center' : 'mdi-format-horizontal-align-left'"
      :color="showDetail ? 'primary' : 'grey'"
      @click="emit('showDetailToggle')"
      variant="text"
    ></v-btn>
  </v-toolbar>
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { useGoTo } from 'vuetify'
import { useInputFiltering } from '../mixins/inputFiltering'

const store = useQuranStore()
const router = useRouter()
const goTo = useGoTo() // Add this line
const { highlight } = useInputFiltering()
// Reactive state
const loading = ref(true)
const search = ref('')
const props = defineProps(['showDetail'])

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
</script>

<style>
.indexStyle {
  width: auto !important;
}

.searchBox {
  padding-bottom: 0px;
  margin-bottom: -21px;
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
  background: rgba(var(--v-theme-hover-color)) !important;
  /* opacity: 0.7; */
}

#indexBlock .v-table--fixed-header > .v-table__wrapper {
  overflow-x: hidden !important;
  margin-left: -11px;
}
</style>
