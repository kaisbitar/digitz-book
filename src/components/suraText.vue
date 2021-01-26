<template>
  <div class="wrapper">
    <div  class="d-flex suraHeader">

      <suraTextSelectControl
        :selectedVerse="suraTargetedVerse"
        :inputText="inputText"
        style="width:100px"
      />
    </div>
    <v-row outlined class="pa-2  grey lighten-4" id="suraBlock" :style="getheight()">
      <suraTextBox
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
      />
    <v-card class="sadakAllah caption mr-auto elevation-0 pa-2 mt-1">- صدق الله العظيم -</v-card>
    </v-row>

  </div>
</template>

<script>
import suraTextSelectControl from './suraTextSelectControl.vue'
import suraTextBox from './suraTextBox.vue'
import { appMixin } from '../mixins/mixins'

export default {
  name: '',
  components: { suraTextSelectControl, suraTextBox },
  props: ['numberOfVerses', 'numberOfWords', 'numberOfLetters', 'suraTextItems', 'inputText', 'suraTargetedVerse', 'isLoading'],
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
      var heightDif = this.windowHeight - 180
      var str = 'height:' + heightDif + 'px'
      return str
    }
  },
  computed: {
    suraselectedSearch () {
      return this.$store.getters.filterSelectedIndex
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
    // this.$store.commit('setDrawerState', true)
    this.$store.commit('setNumberInfoShow', true)
  },
  mounted () {
  }
}
</script>

<style>
.wrapper{
  /* height: fit-content; */
}
#suraBlock{
    padding-right: 9px;
    padding-left: 9px;
    /*grey*/
    border: 1px solid #9e9e9e !important;
    overflow-y: scroll;
}
.sadakAllah{
  width: 125px;
  height: 40px;
}
.suraHeader{
  height: 89px;
}
</style>
