<template>
  <label>
    <div class="titleWrap">
      <div class="parentTitle ">
        <span class="blue white--text pr-1 pl-1 ml-1" v-if="parentcount">{{parentcount}} آية</span>
        <span class="green white--text pr-1 pl-1" v-if="parentSearch">{{parentSearch}}</span>
      </div>
      <h2 class="elTitle">{{ title }}</h2>
      <div class="d-flex">
        <div class="d-flex brown--text text--lighten-2 ml-3">
          {{ numberOfVerses }}
          <div class="titleInfoLabel black--text">آية</div>
        </div>

        <div class="d-flex brown--text text--lighten-2 ml-3">
          {{ numberOfWords }}
          <span class="titleInfoLabel black--text">كلمة</span>
        </div>

        <div class="d-flex brown--text text--lighten-2 ml-3">
          {{ numberOfLetters }}
          <div class="titleInfoLabel black--text">حرف</div>
        </div>
      </div>
      <!-- <h5 class="basmaleh">بسم الله الرحمن الرحيم</h5> -->
    </div>
    <div class="arrowsWrap">
      <div @click="arrowClick('up')">
        <v-icon >mdi-chevron-up</v-icon>
      </div>
      <div @click="arrowClick('down')">
        <v-icon class="downArr"
          >mdi-chevron-down</v-icon
        >
      </div>
    </div>
  </label>
</template>

<script>
export default {
  name: 'glTitle',
  props: ['title', 'parentSearch', 'parentcount', 'numberOfVerses', 'numberOfWords', 'numberOfLetters'],
  components: {},
  data: () => ({
    showInfo: true
  }),
  computed: {},
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
.parentTitle{
  font-size: 10px;
  height: 15px;
  width: fit-content;
  font-weight: bold;
}
.titleInfoLabel{
  margin-top: 4px;
  margin-right: 2px;
  font-size: 12px;
}
@media (max-width: 600px) {
  .basmaleh {
    font-size: 12px;
    margin-top: 0px !important;
  }
}
</style>
