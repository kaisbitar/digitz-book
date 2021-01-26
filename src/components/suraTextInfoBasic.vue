<template>
  <div>
    <div class="titleWrap">
      <h1 class="suraTitle">{{ title }}</h1>
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
    </div>
    <div class="arrowsWrap">
      <div>
        <v-icon @click="arrowClick('up')">mdi-chevron-up</v-icon>
      </div>
      <div>
        <v-icon  @click="arrowClick('down')" class="downArr"
          >mdi-chevron-down</v-icon
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'suraTextInfoBasic',
  props: ['title', 'numberOfVerses', 'numberOfWords', 'numberOfLetters'],
  components: {},
  data: () => ({
    showInfo: true
  }),
  computed: {
    numberInfoShow () {
      return this.$store.getters.numberInfoShow
    }
  },
  methods: {
    arrowClick (direction) {
      this.$emit('arrowClick', direction)
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
