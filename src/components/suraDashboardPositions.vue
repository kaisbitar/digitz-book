<template>
  <v-card class="mr-2 webKitWidth" outlined>
    <div class="d-flex ml-1 pa-2" outlined>
      <v-card class="resultBox display-3 text-center pa-3" outlined>
        <div class="mt-n1">{{ suraDetailElement }}</div>
      </v-card>
      <span class="display-3 mr-2 ml-2 mt-3">:</span>
      <v-card class="resultBox d-flex text-center pa-3" outlined>
        <span class="display-3">{{ suraDetailCount }}</span>
        <div class="mt-7">مرة</div>
      </v-card>
    </div>
    <div class="mt-2 mr-2">المواقع: </div>
    <v-row
      class="wordItemWrap mr-2 mt-4"
    >
      <div
        class="wordItem"
        :class="getClass()"
        v-for="(item, key) in positions"
        :key="key"
      >
        <span>{{ item }}</span>
      </div>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'suraDashboardDetails',
  props: [
    'suraDetailElement',
    'suraDetailCount',
    'selectedDetailsData'
  ],
  components: {},
  data: () => ({
    positions: null,
    series: [],
    isLoading: true,
    windowHeight: window.windowHeight,
    test: 'background: black'
  }),
  methods: {
    extarctItem () {
      if (this.selectedDetailsData.length === []) return
      var result = this.selectedDetailsData.filter((obj, key) => {
        return obj[this.suraDetailElement]
      })

      result = result[0]
      this.positions = result[this.suraDetailElement]
    },
    getClass (item) {
    },
    getheight () {
      var heightDif = this.windowHeight - 280
      return heightDif + 'px'
    }
  },
  computed: {},
  watch: {
    suraDetailElement () {
      this.extarctItem()
    }
  },
  created () {},
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
