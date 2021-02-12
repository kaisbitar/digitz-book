<template>
  <v-card flat class="dashVersesLabels">
    <div class="d-flex mb-2">
      <v-card class="text-center pa-3 ml-2" outlined>
        <span class="numberInfo mt-n1 body-1">{{ numberOfWords }}</span>
        <span class="infoLabel"> كلمة</span>
      </v-card>

      <v-card class="text-center pa-3 ml-2" outlined>
        <span class="numberInfo mt-n1 body-1">{{ numberOfLetters }}</span>
        <span class="infoLabel"> حرف</span>
      </v-card>
      <v-card class="text-center pa-3" outlined>
        <span class="numberInfo mt-n1 body-1">{{ bigIndx }}</span>
        <span class="infoLabel"> مصحف</span>
      </v-card>
    </div>

    <div class="d-flex">
      <v-card class="text-center pa-3 ml-2" outlined>
        <span class="infoLabel">رقم </span>
        <span class="numberInfo mt-n1 body-1">{{ verseIndx }}</span>
      </v-card>
      <v-card class="verseText pa-3" outlined>
        <span> {{ verseText }}</span>
      </v-card>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'dashVersesLabels',
  props: [
    'verseIndx',
    'numberOfLetters',
    'numberOfWords',
    'verseText',
    'bigIndx'
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
  font-size: 17px;
}
.infoLabel {
  font-size: 12px;
  color: #909090;
}
</style>
