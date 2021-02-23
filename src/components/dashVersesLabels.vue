<template>
    <div class="d-flex">
      <v-card  class="grey lighten-5 verseText pa-3 ma-auto mt-3" outlined>
        <span class="grey--text  text--darken-3 font-weight-light"> {{ verseText }}</span>
      </v-card>
    </div>
</template>

<script>
export default {
  name: 'dashVersesLabels',
  props: [
    'verseIndex',
    'numberOfLetters',
    'numberOfWords',
    'verseText',
    'verseNumberToQuran',
    'isLoadingLocal'
  ],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style>
.numberInfo {
  color: #6c6c6c !important;
}
.verseText {
  font-size: 20px;
  background: #fbfbfb;
  border: 1px solid #ccc;
  text-align: right;
  color: grey;
}
.infoLabel {
  font-size: 12px;
  color: #909090;
}
</style>
