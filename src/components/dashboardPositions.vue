<template>
  <v-card class="mr-2 webKitWidth" outlined>
    <div class="d-flex ml-1 pa-2" outlined>
      <v-card class="resultBox display-3 text-center pa-3" outlined>
        <div class="mt-n1">{{ detailElement }}</div>
      </v-card>
      <span class="display-3 mr-2 ml-2 mt-3">:</span>
      <v-card class="resultBox d-flex text-center pa-3" outlined>
        <span class="display-3">{{ detailCount }}</span>
        <div class="mt-7">مرة</div>
      </v-card>
    </div>

    <div class="mt-2 mr-2">المواقع: </div>
    <v-row
      class="wordItemWrap mr-2 mt-4"
    >
      <div
        class="wordItem"
        v-for="(item, key) in positions"
        :key="key"
      >
        <span>{{ item }}</span>
      </div>
    </v-row>
     <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: 'dashboardPositions',
  props: [
    'detailElement',
    'detailCount',
    'detailsData',
    'isLoading'
  ],
  components: {},
  data: () => ({
    positions: null,
    series: [],
    test: 'background: black'
  }),
  methods: {
    extarctItem () {
      if (!this.detailsData) return
      var result = this.detailsData.filter((obj, key) => {
        return obj[this.detailElement]
      })
      result = result[0]
      this.positions = result[this.detailElement]
    }
  },
  computed: {},
  watch: {
    detailsData () {
      this.extarctItem()
    },
    detailElement () {
      this.extarctItem()
    }
  },
  created () {
    this.extarctItem()
  },
  mounted () {
  }
}
</script>

<style>
.wordItem {
  margin: 5px;
  padding: 5px;
  border: 1px solid #bebebe;
  border-radius: 3px;
  background: #efefef8c;
  width: 70px;
  text-align: center;
}
.wordItemWrap {
  overflow-y: scroll;
  max-height:270px;
}
</style>
