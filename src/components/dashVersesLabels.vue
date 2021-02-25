<template>
  <div class="">
    <div class="mt-4">
      <v-chip label class="lighten-5 grey mr-2"
        ><span class=" ml-1">سورة </span> {{ suraName }} {{ verseIndex }}</v-chip
      >
      <v-chip label class="lighten-5 grey mr-2"
        ><span class="ml-1">ترتيب في المصحف </span>
        {{ verseNumberToQuran }}</v-chip
      >
      <v-chip label class="lighten-5 grey mr-2"
        >{{ numberOfWords }}<span class="mr-1">كلمة </span> </v-chip
      >
      <v-chip label class="lighten-5 grey mr-2"
        >{{ numberOfLetters }}<span class="mr-1">حرف </span> </v-chip
      >
    </div>
    <v-card class="grey lighten-5 verseText pa-3 ma-auto mt-3" outlined>
      <span
        class="grey--text text--darken-3 font-weight-light"
        v-html="highlight(verseText, inputText)"
      ></span>
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
    'inputText',
    'suraName'
  ],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    highlight (text, toHighlight) {
      return text.replace(new RegExp(toHighlight, 'gi'), (match) => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    }
  },
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
  text-align: center;
  color: grey;
  width: -webkit-fill-available;
}
.infoLabel {
  font-size: 12px;
  color: #909090;
}
.verseCaption {
  font-family: '"Roboto", sans-serif !important';
}
</style>
