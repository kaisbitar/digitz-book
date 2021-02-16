<template>
  <div class="singleSura">
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
    <suraText
      v-if="view === 'suraText'"
      :inputText="inputText"
      :suraTargetedVerse="suraTargetedVerse"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :suraTextarray="suraTextarray"
      :isLoading="isLoading"
    />
    <dashbord
      v-if="view === 'suraChart' && details"
      :title="fileName"
      @tabChanged="getData"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :wordOccurrences="details.wordOccurrences"
      :letterIndexes="details.letterIndexes"
      :letterOccurrences="details.letterOccurrences"
      :letterSeries="letterSeries"
      :wordsSeries="wordsSeries"
      :suraTextarray="suraTextarray"
      :versesBasics="versesBasics"
      :activeTab="activeTab"
    />
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
    activeTab: 'numberOfWords'
  }),
  computed: {
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
        .dispatch('getSuraText')
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
        .dispatch('getVersesMap')
        .then((items) => {
          this.versesBasics = items
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    },
    getData (tab) {
      this.activeTab = tab
      switch (tab) {
        case 'numberOfVerses':
          this.fetchVersesData()
          return
        case 'numberOfWords':
        case 'numberOfLetters':
          this.fetchSuraDetails()
          break
        case 'frequency':
          this.fetchSuraText()
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
    }
  },
  watch: {
    fileName () {
      this.isLoading = true
      this.details = {}
      setTimeout(() => {
        this.fetchSuraBasics().then(() => {
          if (this.view === 'suraText') {
            this.fetchSuraText()
            return
          }
          this.getData(this.activeTab)
        })
      }, 200)
    },
    view () {
      this.getData(this.activeTab)
    }
  },
  created () {
    this.fetchSuraBasics().then(() => {
      this.getData(this.activeTab)
    })
  },
  mounted () {}
}
</script>

<style>
.singleSura {
  padding-right: 19px;
  padding-left: 19px;
}

.suraInfoBox {
  padding: 24px;
  margin-left: 10px;
  width: 181.5px;
  display: flex;
}
.arrowsWrap {
  width: -webkit-fit-content;
  margin-right: auto;
  margin-top: -85px;
}
.numberInfo {
  width: 191px;
  margin-top: -9px;
}
.titleWrap {
  width: 259px;
  height: 94px;
  margin-right: -12px;
  margin-top: -9px;
}
.downArr {
  margin-top: 18px !important;
}
h5.basmaleh {
  width: 142px;
}
.charSwitch {
  margin-right: 56px;
  width: 72px;
  z-index: 2;
  margin-top: 14px;
}
.switchLabel {
  margin: auto;
  width: fit-content;
  /* grey lighten-1*/
  color: #BDBDBD
}
</style>
