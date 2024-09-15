<template>
  <div>
    <div
      class="suraText"
      v-for="(item, index) in suraTextArray"
      :key="index"
      :class="[
        index - 1,
        { 'bg-yellow-accent-1 targetedVerse': index + 1 === parseInt(suraTargetedVerseIndex) },
      ]"
      @click="setTargetedVerse(item, index + 1)"
    >
      <div :id="'v' + (index + 1)">
        <div
          class="numChip"
          label
          :class="[{ 'bg-grey text-white': index + 1 === suraTargetedVerseIndex }]"
        >
          {{ index + 1 }}
        </div>
        <div v-if="inputText" class="d-inline" v-html="highlightVerse(item, inputText)"></div>
        <div v-else class="d-inline">{{ item }}</div>
      </div>
    </div>
    <v-row justify="center" class="suraTextSearchResults">
      <v-overlay color="white" :model-value="isLoading" scrim="white" :opacity="0.8">
        <v-progress-circular color="indigo" indeterminate></v-progress-circular>
      </v-overlay>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useMixin } from '../mixins/mixins'
import { useGoTo } from 'vuetify' // Add this import

const { prepareToScroll } = useMixin()

// Props
const props = defineProps(['inputText', 'suraTargetedVerseIndex', 'suraTextArray', 'isLoading'])

// Store and Vuetify
const store = useQuranStore()

// Data
const suraText = ref([])

const goTo = useGoTo()
// Methods
const scrollToVerse = async () => {
  await nextTick()
  if (!document.getElementById('suraBlock')) return
  goTo('.targetedVerse', {
    container: '#suraBlock',
    offset: -100,
  })
}

const setTargetedVerse = (verse, index) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: index,
    verseNumberToQuran: verse.verseNumberToQuran,
  })
}

// Computed properties
const scrollTrigger = computed(() => store.getScrollTrigger)
const fileName = computed(() => store.getTarget.fileName)
const activeView = computed(() => store.getTarget.activeView)

// Watchers
watch(scrollTrigger, () => {
  if (activeView.value === 'detailView') return
  const verse = prepareToScroll(props.suraTargetedVerseIndex)
  scrollToVerse(verse)
})

watch(
  () => props.suraTargetedVerseIndex,
  () => {
    if (activeView.value === 'detailView') return
    const verse = prepareToScroll(props.suraTargetedVerseIndex)
    scrollToVerse(verse)
  },
)

// Filters
const highlightVerse = (text, value) => {
  if (value === null) return text
  text = text.replace(/[\u064b-\u064f\u0650-\u0652]/g, '')
  const query = new RegExp(value, 'ig')
  return text.replace(query, match => {
    return '<span class="bg-orange-lighten-3 font-weight-bold">' + match + '</span>'
  })
}

// Lifecycle hooks
onMounted(() => {
  scrollToVerse(prepareToScroll(props.suraTargetedVerseIndex))
})
</script>

<style>
.suraText {
  padding: 5px !important;
  /* background: white; */
  margin: 1px;
  display: -webkit-inline-box;
  border-radius: 4px;
  cursor: pointer;
}
.numChip {
  /* brown lighten-5 */
  /* width: 41px; */
  background: #efebe9;
  margin-left: 6px;
  padding-right: 12px;
  padding-left: 12px;
  margin-bottom: 4px;
  display: -webkit-inline-box;
}
.TargetedChip {
  color: white !important;
  /* grey darken-1 */
  background: #757575 !important;
}
@media (max-width: 655px) {
  .suraTextSearchResults {
    display: block;
  }
}
</style>
