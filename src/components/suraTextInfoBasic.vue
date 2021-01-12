<template>
  <v-card flat class="">
    <v-row class="mt-n1">
      <div class="d-flex numberInfo">
        <v-card class="mr-1 pl-1 pr-1 elevation- lighten-5" flat>
          <span
            v-if="numberOfVerses !== null"
            class="brown--text text--lighten-2 caption"
            >{{ numberOfVerses }}</span
          >
          <span class="caption">آية</span>
        </v-card>

        <v-card class="mr-1 pl-1 pr-1 elevation- lighten-5" flat>
          <span
            v-if="numberOfVerses"
            class="brown--text text--lighten-2 caption"
            >{{ numberOfWords }}</span
          >
          <span class="caption">كلمة</span>
        </v-card>

        <v-card class="mr-1 pl-1 pr-1 elevation- lighten-5" flat>
          <span
            v-if="numberOfVerses"
            class="brown--text text--lighten-2 caption"
            >{{ numberOfLetters }}</span
          >
          <span class="caption">حرف</span>
        </v-card>
      </div>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'suraTextInfoBasic',
  props: ['numberOfVerses', 'numberOfWords', 'numberOfLetters'],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style>
</style>
