<template>
  <div class="singleSura">
    <div class="chartIcon" :class="view === 'suraChart' ? 'chartMargin' : 'textMargin'">
      <v-icon  @click="getView()" :color="iconColor"
        >mdi-view-dashboard-variant-outline</v-icon
      >
    </div>
    <suraText
      v-if="view === 'suraText'"
      :inputText="inputText"
      :suraTargetedVerse="suraTargetedVerse"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
    />
    <suraDashbord
      v-if="view === 'suraChart'"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
    />
  </div>
</template>

<script>
import suraText from '../components/suraText.vue'
import suraDashbord from '../components/suraDashbord.vue'

export default {
  name: 'singleSura',
  components: {
    suraText,
    suraDashbord
  },
  data: () => ({
    suraTextItems: {},
    isLoading: true,
    view: 'suraChart',
    suraBasics: null,
    numberOfVerses: null,
    numberOfWords: null,
    numberOfLetters: null,
    iconColor: 'grey'
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
    fetchSuraBasics () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraBasics')
        .then((items) => {
          this.suraBasics = items
          this.numberOfVerses = items.numberOfVerses
          this.numberOfWords = items.numberOfWords
          this.numberOfLetters = items.numberOfLetters
        })
        .then((items) => {
          this.isLoading = false
        })
    },
    getView () {
      if (this.view === 'suraText') {
        this.iconColor = 'blue'
        this.view = 'suraChart'
        return
      }
      this.iconColor = 'grey'
      this.view = 'suraText'
    }
  },
  watch: {
    fileName () {
      this.fetchSuraBasics()
    }
  },
  created () {
    this.fetchSuraBasics()
  },
  mounted () {
    // this.fetchSuraBasics()
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
  margin-right: 187px;
  position: fixed;
}
</style>
