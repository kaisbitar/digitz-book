<template>
  <div>
    <div class="titleWrap">
      <h1 class="suraTitle">{{ fileName }}</h1>
      <!-- <div> -->
      <div v-if="numberInfoShow" class="d-flex">
        <div class="d-flex brown--text text--lighten-2 caption ml-3">
          {{ numberOfVerses }}
          <div class="black--text">آية</div>
        </div>

        <div class="d-flex brown--text text--lighten-2 caption ml-3">
          {{ numberOfWords }}
          <div class="black--text">كلمة</div>
        </div>

        <div class="d-flex brown--text text--lighten-2 caption ml-3">
          {{ numberOfLetters }}
          <div class="black--text">حرف</div>
        </div>
      </div>
      <h5 class="basmaleh">بسم الله الرحمن الرحيم</h5>
      <!-- </div> -->
    </div>
    <div class="arrowsWrap">
      <div>
        <v-icon @click="handleSuraArrowClick('up')">mdi-chevron-up</v-icon>
      </div>
      <div>
        <v-icon class="downArr" @click="handleSuraArrowClick('down')"
          >mdi-chevron-down</v-icon
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'suraTextInfoBasic',
  props: ['numberOfVerses', 'numberOfWords', 'numberOfLetters'],
  components: {},
  data: () => ({
    showInfo: true
  }),
  computed: {
    fileName () {
      return this.$store.state.target.fileName
    },
    numberInfoShow () {
      return this.$store.getters.numberInfoShow
    }
  },
  methods: {
    handleSuraArrowClick (direction) {
      if (direction === 'up') {
        var targetrSura = {
          fileName: this.$store.getters.quranIndex[
            this.$store.getters.target.suraNumber - 2
          ].fileName
        }
        this.$store.commit('setTarget', targetrSura)
        return
      }
      targetrSura = {
        fileName: this.$store.state.quranIndex[
          this.$store.state.target.suraNumber
        ].fileName
      }
      this.$store.commit('setTarget', targetrSura)
    }
  },
  created () {},
  mounted () {}
}
</script>

<style >
@media (max-width: 600px) {
  .basmaleh {
    /* position: static; */
    /* text-align: center; */
    font-size: 12px;
    margin-top: 0px !important;
  }
}
</style>
