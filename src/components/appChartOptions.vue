<template>
  <div class="appChartOptions">
    <v-row>
      <v-radio-group class="d-flex chartTitleWrap" v-model="type" row>
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
    type: 'words'
  }),
  methods: {},
  computed: {},
  watch: {
    type () {
      this.$emit('typeChanged', this.type)
    }
  },
  created () {},
  updated () {},
  mounted () {}
}
</script>

<style >
</style>
