<template>
  <v-card  class="webKitWidth" flat>
      <dashLabels
        :detailElement="detailElement"
        :detailCount="detailCount"
        :isLoading="isLoading"
        :showPosition="false"
      />
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
import dashLabels from './dashLabels'
export default {
  name: 'dashLabelsPositions',
  props: [
    'detailElement',
    'detailCount',
    'detailsData',
    'isLoading',
    'showPosition'
  ],
  components: { dashLabels },
  data: () => ({
    positions: null,
    series: [],
    test: 'background: black'
  }),
  methods: {
    extarctItem () {
      if (!this.detailsData) return
      this.positions = this.detailsData[this.detailElement]
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

  },
  mounted () {
    this.extarctItem()
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
  max-height:200px;
}
</style>
