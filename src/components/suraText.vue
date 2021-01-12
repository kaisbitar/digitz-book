<template>
  <div id="wrapper">
    <div class="infoBar">
      <suraTextInfoBar
        :numberOfVerses="items.numberOfVerses"
        :numberOfWords="items.numberOfWords"
        :numberOfLetters="items.numberOfLetters"
        :selectedVerse="suraTargetedVerse"
        :inputText="inputText"
        :items="items"
      />
    </div>
    <v-card outlined class="mt-2 pa-2  grey lighten-4" id="suraBlock" :style="getheight()">
      <suraTextBox
        v-if="items"
        :items="items"
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
      />
    <v-card class="sadakAllah caption mr-auto elevation-0 pa-2 mt-1">- صدق الله العظيم -</v-card>
    </v-card>
    <v-row justify="center">
      <v-overlay
        color="white"
        :absolute="false"
        :opacity="0.8"
        :value="isLoading"
      >
        <v-progress-circular color="indigo" indeterminate></v-progress-circular>
      </v-overlay>
    </v-row>
  </div>
</template>

<script>
import suraTextInfoBar from './suraTextInfoBar.vue'
import suraTextBox from './suraTextBox.vue'

export default {
  name: '',
  components: { suraTextInfoBar, suraTextBox },
  data: () => ({
    items: {},
    isLoading: true,
    windowHeight: window.innerHeight
  }),
  methods: {
    fetchSura () {
      this.isLoading = true
      this.$store
        .dispatch('getSura')
        .then((items) => {
          this.items = items
          return items
        })
        .then((items) => {
          this.isLoading = false
        })
    },
    scrollOptions () {
      return {
        duration: 1,
        offset: 2,
        easing: 'easing'
      }
    },
    getheight () {
      console.log(this.windowHeight)
      var heightDif = this.windowHeight - 175
      var str = 'height:' + heightDif + 'px'
      return str
    }
  },
  computed: {
    surafileName () {
      return this.$store.getters.target.fileName
    },
    suraTargetedVerse () {
      return this.$store.getters.target.verseIndex
    },
    suraselectedSearch () {
      return this.$store.getters.filterSelectedIndex
    },
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
    wrapperHeight () {
      const filterSectionDOM = document.getElementById('wrapper')
      return filterSectionDOM ? filterSectionDOM.offsetHeight : 'auto'
    }
  },
  watch: {
    windowHeight () { this.getheight() },
    surafileName () {
      this.fetchSura()
    }
  },
  created () {
    console.log(this.wrapperHeight)
  },
  mounted () {
    this.fetchSura()
  }
}
</script>

<style>
#suraBlock{
    padding-right: 9px;
    padding-left: 9px;
    /*grey*/
    border: 1px solid #9e9e9e !important;
    overflow-y: scroll;
}
.sadakAllah{
  width: 125px;
}
</style>
