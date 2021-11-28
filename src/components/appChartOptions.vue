<template>
  <div class="appChartOptions">
    <v-row>
      <v-radio-group class="d-flex chartTitleWrap" v-model="typeLocal" row>
        تواتر
        <v-radio value="words" label="كلمات" color="blue"></v-radio>
        <v-radio value="letters" label="حروف" color="blue"></v-radio>
      </v-radio-group>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'appChartOptions',
  props: ['type'],
  components: {},
  data: () => ({
    typeLocal: 'words'
  }),
  methods: {},
  computed: {},
  watch: {
    typeLocal () {
      this.$emit('typeChanged', this.typeLocal)
    }
  },
  created () {},
  updated () {},
  mounted () {
    this.typeLocal = this.type
  }
}
</script>

<style >
</style>
