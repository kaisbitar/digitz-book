<template>
  <v-dialog  max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline ml-1">{{ suraName }}</span> -
        <span class="headline mr-1">آية رقم: {{ verseIndex }}</span>
      </v-card-title>
      عدد الكلمات: {{ numberOfWords }} عدد الحروف: {{ numberOfLetters }}
      <v-card-text>
        <v-textarea v-model="localText" label="حرر الآية"></v-textarea>
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
  props: ['showEditVerse', 'suraName', 'verseIndex', 'verseText'],
  data: () => ({
    localText: ''
  }),
  methods: {
    close () {
      this.$emit('close')
    },
    save () {}
  },
  computed: {
    numberOfWords () {
      if (!this.localText) return 0
      return this.localText.trim().split(' ').length
    },
    numberOfLetters () {
      return this.localText.split(' ').join('').length
    }
  },
  watch: { },
  mounted () {
    this.localText = this.verseText
  }
}
</script>
