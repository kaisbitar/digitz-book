<template>
  <div class="compWrapper">
    <v-row>
      <suraTextInfoBasic
        class="pr-3"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :title="fileName"
        @arrowClick="setTargetFromArrow"
      />
      <div class="charSwitch">
        <v-card
          @click="getView()"
          outlined
        >
          <div class="grey lighten-4 d-flex">
            <div class="switchLabel caption" :class="[{ 'active': view === 'suraChart' }]">تفصيل</div>
          </div>
        </v-card>
      </div>
    </v-row>
    <keepAlive>
      <suraText
        v-if="view === 'suraText'"
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :suraTextarray="suraTextarray"
        :isLoading="isLoading"
    /></keepAlive>
    <keepAlive>
      <dashbord
        v-if="view === 'suraChart' && details"
        :title="fileName"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :isLoading="isLoading"
        :wordIndexes="details.wordIndexes"
        :letterSeries="letterSeries"
        :wordsSeries="wordsSeries"
        :versesSeries="versesSeries"
        :suraTextarray="suraTextarray"
        :versesBasics="versesBasics"
        :activeTab="activeTab"
    /></keepAlive>
  </div>
</template>

<script>
import suraText from '../components/suraText.vue'
import dashbord from '../components/dashbord.vue'
import suraTextInfoBasic from '../components/suraTextInfoBasic'
import { appMixin } from '../mixins/mixins'

export default {
  name: 'singleSura',
  mixins: [appMixin],
  components: {
    suraText,
    dashbord,
    suraTextInfoBasic
  },
  data: () => ({
    suraTextarray: [],
    versesBasics: [],
    isLoading: false,
    view: 'suraChart',
    numberOfVerses: null,
    numberOfWords: null,
    numberOfLetters: null,
    iconColor: 'grey',
    details: {},
    letterSeries: [],
    wordsSeries: [],
    versesSeries: []
  }),
  computed: {
    activeTab () {
      return this.$store.getters.activeTab
    },
    inputText () {
      if (
        this.$store.getters.filteredSearch.length === 0 ||
        this.$store.getters.filterSelectedIndex === 0
      ) {
        return
      }
      return this.$store.getters.filteredSearch[
        this.$store.getters.filterSelectedIndex
      ].inputText
    },
    suraTargetedVerse () {
      return this.$store.getters.target.verseIndex
    },
    fileName () {
      return this.$store.getters.target.fileName
    },
    tableQuranIndex () {
      return this.$store.getters.tableQuranIndex
    }
  },
  methods: {
    async fetchSuraBasics () {
      this.isLoading = true
      return new Promise((resolve) => {
        this.$store.dispatch('getSuraBasics').then((items) => {
          this.numberOfVerses = items.numberOfVerses
          this.numberOfWords = items.numberOfWords
          this.numberOfLetters = items.numberOfLetters
          this.isLoading = false
          resolve()
        })
      })
    },
    fetchSuraDetails () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraDetails')
        .then((items) => {
          this.details = items
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    },
    fetchSuraChartData () {
      this.isLoading = true

      if (this.fileName === '000المصحف') {
        this.wordsSeries = this.getMushafSeries('numberOfWords')
        this.letterSeries = this.getMushafSeries('numberOfLetters')
        this.versesSeries = this.getMushafSeries('numberOfVerses')
        this.isLoading = false

        return
      }

      this.$store
        .dispatch('getSuraChartData')
        .then((items) => {
          this.letterSeries = [{ data: items.letters }]
          this.wordsSeries = [{ data: items.words }]
        })
        .then(() => {
          this.isLoading = false
        })
    },
    fetchSuraText () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraText2')
        .then((items) => {
          this.suraTextarray = items
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    },
    fetchVersesData () {
      this.isLoading = true
      this.$store
        .dispatch('getVersesMap2')
        .then((items) => {
          this.versesBasics = items
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    },
    getData () {
      switch (this.activeTab) {
        case 'numberOfVerses':
          this.fetchVersesData()
          return
        case 'numberOfWords':
          this.fetchSuraDetails()
          break
        case 'frequency':
          this.fetchSuraChartData()
          break
      }
    },
    getView () {
      if (this.view === 'suraText') {
        this.iconColor = 'info'
        this.view = 'suraChart'
        return
      }
      this.iconColor = 'grey'
      this.view = 'suraText'
      this.fetchSuraText()
    },
    getMushafSeries (dataType) {
      var arr = this.tableQuranIndex.map((item) => {
        return item[dataType]
      })
      arr.shift()
      var series = [{ data: arr }]
      return series
    }
  },
  watch: {
    fileName () {
      this.isLoading = true
      this.details = {}
      this.fetchSuraBasics()
      this.fetchSuraText()
      this.getData()
    },
    view () {
      this.getData()
    },
    activeTab () {
      this.getData()
    }
  },
  created () {
    this.fetchSuraBasics()
    this.getData()
    this.fetchSuraText()
  },
  mounted () {}
}
</script>

<style>

</style>
