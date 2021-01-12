<template>
  <v-card flat  class="singleSura">
    <suraText class="suraTextBlock" />
    <suraDashbord />
  </v-card>
</template>

<script>
import suraText from '../components/suraText.vue'
import suraDashbord from '../components/suraDashbord.vue'
// import chart from '../components/chart.vue'
// import suraDetail from '../components/suraDetail.vue'

export default {
  name: 'singleSura',
  components: {
    suraText,
    suraDashbord
    // chart,
    // suraDetail
  },
  data: () => ({}),
  computed: {},
  methods: {
  },
  created () {},
  mounted () {
  }
}
</script>

<style>
.titeAndIndex {
  /* height: 45px; */
}
.suraTextBlock {
  padding-right: 10px;
  padding-left: 10px;
}
</style>
