<template>
  <div class="d-flex autoCompleteOptionsBar">
    <v-row class="mb-3 mr-4">
      <v-btn
        class="green lighten-2 white--text"
        @click="$emit('btn1Clicked')"
        small
        >{{ btn1Title }}</v-btn
      >
      <v-card class="elevation-0 searchLabel label mr-4 pl-2 pr-2" outlined>
        <span v-if="textValue" class="yellow ml-1">"{{ textValue }}" </span>
        <span class="title mt-n6"> {{ resultCounter }}</span> آية
      </v-card>
      <div v-if="secondBtnCondition > -1" class="mr-4">
        أو
        <v-btn
          class="blue lighten-2 white--text mr-4"
          @click="$emit('btn2Clicked')"
          small
          >{{ btn2Title }}</v-btn
        >
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'autoCompleteOptionsBar',
  props: ['btn1Title', 'resultCounter', 'btn2Title', 'secondBtnCondition', 'textValue'],
  components: {},
  data: () => ({}),
  methods: {},
  computed: {},
  watch: {},
  created () {},
  mounted () {}
}
</script>

<style>
</style>
