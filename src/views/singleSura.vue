<template>
  <div class="singleSura">
    <v-row>
      <suraTextInfoBasic
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :title="fileName"
      @arrowClick="setTargetFromArrow"
      />
      <div class="chartIcon">
        <v-switch
          :color="'info'"
          @click="getView()"
          value="secondary"
          hide-details
          small
        ></v-switch>
      </div>
    </v-row>

    <suraText
      v-if="view === 'suraText'"
      :inputText="inputText"
      :suraTargetedVerse="suraTargetedVerse"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
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
    suraTextItems: {},
    isLoading: false,
    view: 'suraChart',
    numberOfVerses: null,
    numberOfWords: null,
    numberOfLetters: null,
    iconColor: 'grey',
    details: {},
    letterSeries: [],
    wordsSeries: [],
    currentTab: 'frequency'
  }),
  computed: {
    inputText () {
      if (
        this.$store.getters.filteredSearch === [] ||
        this.$store.getters.filterSelectedIndex === null
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
      return new Promise((resolve) => {
        this.isLoading = true
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
      this.$store.dispatch('getSuraDetails').then((items) => {
        this.details = items
        return items
      }).then(() => {
      })
    },
    fetchSuraChartData () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraChartData')
        .then((items) => {
          this.letterSeries = [{ data: items.letters }]
          this.wordsSeries = [{ data: items.words }]
        }).then(() => {
          this.isLoading = false
        })
    },
    getData (tab) {
      this.currentTab = tab
      switch (tab) {
        case 'numberOfVerses':
          return
        case 'numberOfWords':
        case 'numberOfLetters':
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
    }
  },
  watch: {
    fileName () {
      this.isLoading = true
      this.details = {}
      setTimeout(() => {
        this.fetchSuraBasics().then(() => {
          this.getData(this.currentTab)
        })
      }, 200)
    }
  },
  created () {
    this.fetchSuraBasics().then(() => {
      this.getData(this.currentTab)
    })
  },
  mounted () {

  }
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
.compWrap {
  /* margin-top: 96px; */
}
.arrowsWrap {
  margin-right: auto;
  width: -webkit-fit-content;
  margin-top: -85px;
}
.numberInfo {
  width: 191px;
  margin-top: -9px;
}
.titleWrap {
  /* min-width: 241px; */
  width: 259px;
  margin-right: -12px;
  height: 94px;
  /* border: 1px solid #9e9e9e !important; */
  /* position: absolute; */
  margin-top: -9px;
  /* margin-bottom: 9px; */
}
.downArr {
  margin-top: 18px !important;
}
h5.basmaleh {
  /* margin-top: -36px; */
  width: 142px;
}
.chartIcon {
  margin-right: 168px;
  position: fixed;
  zoom: .8;
  margin-top: 8px;
}
</style>
