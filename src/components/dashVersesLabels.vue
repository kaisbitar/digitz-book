<template>
  <div class="">
    <div class="mt-4 textShadow">
      <v-chip label class="lighten-5 grey mr-2"
        ><span class="verseInfoLabel  ml-1">سورة </span> {{ suraName }}</v-chip
      >
      <v-chip label class="lighten-5 grey mr-2"
        ><span class="verseInfoLabel ml-1">رقم </span> {{ verseIndex }}</v-chip
      >
      <v-chip label class="lighten-5 grey mr-2"
        >{{ numberOfWords }}<span class="verseInfoLabel mr-1">كلمة </span>
      </v-chip>
      <v-chip label class="lighten-5 grey mr-2"
        >{{ numberOfLetters }}<span class="verseInfoLabel mr-1">حرف </span>
      </v-chip>
      <v-chip label class="lighten-5 grey mr-2"
        ><span class="verseInfoLabel ml-1">ترتيب في المصحف </span> {{ verseNumberToQuran }}</v-chip
      >
    </div>
    <v-card class="textShadow grey lighten-5 verseText pa-3 ma-auto mt-3" outlined>
      <span
        class="textWrap grey--text text--darken-3"
        v-html="highlight(verseText, highlighted)"
      ></span>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  verseIndex: Number,
  numberOfLetters: Number,
  numberOfWords: Number,
  verseText: String,
  verseNumberToQuran: Number,
  inputText: String,
  suraName: String,
  secondInput: String,
})

const highlighted = computed(() => {
  if (!props.secondInput) return props.inputText
  return props.secondInput
})

const highlight = (text, toHighlight) => {
  return text.replace(new RegExp(toHighlight + '|' + props.inputText, 'gi'), match => {
    if (match === props.inputText) {
      return '<span style="background:yellow">' + match + '</span>'
    }
    return '<span style="background:#ffa5007d">' + match + '</span>'
  })
}
</script>

<style>
.numberInfo {
  color: #6c6c6c !important;
}
.verseText {
  font-size: 16px;
  background: #fbfbfb;
  border: 1px solid #ccc;
  text-align: center;
  color: grey;
  width: -webkit-fill-available;
  height: 100px;
}
.textWrap {
  vertical-align: -webkit-baseline-middle;
}
.infoLabel {
  font-size: 12px;
  color: #909090;
}
.verseCaption {
  font-family: '"Roboto", sans-serif !important';
}
.textShadow {
  text-shadow: 1px 1px 1px #ecebeb;
}
.verseInfoLabel {
  font-size: 11px;
  color: #7f7f7f;
}
</style>
