<template>
  <div>
    <div
      class="suraText"
      v-for="(item, index) in suraTextArray"
      :key="index"
      :class="[index - 1, { targetedVerse: index + 1 === suraTargetedVerse }]"
        @click="setTargetedVerse(index + 1)"
    >
      <div
        :id="'v' + (index + 1)"
        class="d-inline ml-2"
      >
        <v-chip
          class="numChip"
          label
          :class="[{ 'grey white--text': index + 1 === suraTargetedVerse }]"
        >
          {{ index + 1 }}
        </v-chip>
        <div
          v-if="inputText"
          class="d-inline"
          v-html="$options.filters.highlightVerse(item, inputText)"
        ></div>
        <div v-else class="d-inline">{{ item }}</div>
      </div>
    </div>
    <v-row justify="center" class="suraTextSearchResults">
      <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
        <v-progress-circular color="indigo" indeterminate></v-progress-circular>
      </v-overlay>
    </v-row>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'suraTextBox',
  props: ['inputText', 'suraTargetedVerse', 'suraTextArray', 'isLoading'],
  components: {},
  mixins: [appMixin],
  data: () => ({
    suraText: []
  }),
  methods: {
    scrollToVerse (verse) {
      if (!document.getElementById('suraBlock')) return
      setTimeout(() => {
        this.$vuetify.goTo(verse.toString(), {
          container: '#suraBlock',
          offset: 0
        })
      }, 50)
    },
    setTargetedVerse (index) {
      var target = {
        fileName: this.$store.getters.target.fileName,
        verseIndex: index
      }
      this.$store.commit('setTarget', target)
    }
  },
  computed: {
    scrollTrigger () {
      return this.$store.state.scrollTrigger
    },
    fileName () {
      return this.$store.getters.target.fileName
    },
    activeView () {
      return this.$store.getters.target.activeView
    }
  },
  watch: {
    scrollTrigger () {
      if (this.activeView === 'suraChart') return
      var verse = this.prepareToScroll(this.suraTargetedVerse)
      this.scrollToVerse(verse)
    },
    suraTargetedVerse () {
      if (this.activeView === 'suraChart') return
      var verse = this.prepareToScroll(this.suraTargetedVerse)
      this.scrollToVerse(verse)
    }
  },
  filters: {
    highlightVerse: function (text, value) {
      if (value === null) return text
      text = text.replace(/[\u064b-\u064f\u0650-\u0652]/g, '')
      var qurey = new RegExp(value, 'ig')
      return text.replace(qurey, (match) => {
        return '<span class="orange accent-1">' + match + '</span>'
      })
    }
  },
  created () {},
  mounted () {
    var verse = this.prepareToScroll(this.suraTargetedVerse)
    this.scrollToVerse(verse)
  },
  updated () {}
}
</script>

<style>
.suraText {
  padding: 5px !important;
  background: white;
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
}
.targetedVerse {
  /* yellow accent-1 */
  background: #ffff8d;
}
.TargetedChip {
  color: white !important;
  /* grey darken-1 */
  background: #757575 !important;
}
@media (max-width:655px){
  .suraTextSearchResults{
    display: block;
  }
}
</style>
