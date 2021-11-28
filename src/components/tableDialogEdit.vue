<template>
  <v-dialog v-model="showEditVerse" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline ml-1">{{ suraName }}</span> -
        <span class="headline mr-1">آية رقم: {{ verseIndex }}</span>
      </v-card-title>
      عدد الكلمات: {{ numberOfWords }} عدد الحروف: {{ numberOfLetters }}
      <v-card-text>
        <v-textarea v-model="verseText" label="حرر الآية"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['showEditVerse', 'suraName', 'verseIndex', 'numberOfWords', 'numberOfLetters', 'verseText'],
  data: () => ({
  }),
  methods: {
    close () {
      this.$emit('close')
    },
    save () {}
  },
  computed: { },
  watch: {},
  created () {}
}
</script>
