<template>
  <div class="wrapper">
    <v-row outlined class="pa-2  grey lighten-4" id="suraBlock" :style="getheight()">
      <suraTextBox
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
        :suraTextArray="suraTextArray"
        :isLoading="isLoading"
      />
    <span  class="sadakAllah mr-auto white pa-2 mt-1">صدق الله العظيم</span>
    </v-row>

  </div>
</template>

<script>
import suraTextBox from './suraTextBox.vue'
import { appMixin } from '../mixins/mixins'

export default {
  name: 'suraText',
  components: { suraTextBox },
  props: ['numberOfVerses', 'numberOfWords', 'numberOfLetters', 'suraTextArray', 'inputText', 'suraTargetedVerse', 'isLoading'],
  mixins: [appMixin],
  data: () => ({
    windowHeight: window.innerHeight
  }),
  methods: {
    scrollOptions () {
      return {
        duration: 1,
        offset: 2,
        easing: 'easing'
      }
    },
    getheight () {
      var heightDif = this.windowHeight - 140
      var str = 'height:' + heightDif + 'px'
      return str
    }
  },
  computed: {
    suraselectedSearch () {
      return this.$store.getters.selectedSearchIndex
    },
    wrapperHeight () {
      const filterSectionDOM = document.getElementById('wrapper')
      return filterSectionDOM ? filterSectionDOM.offsetHeight : 'auto'
    },
    fileName () {
      return this.$store.state.target.fileName
    }
  },
  watch: {
    windowHeight () { this.getheight() }

  },
  created () {
  },
  mounted () {
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
  height: 40px;
}
</style>
