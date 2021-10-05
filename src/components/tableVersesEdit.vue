<template>
 <v-dialog
  v-model="dialog"
  max-width="500px"
>
  <v-card>
    <v-card-title>
      <span class="headline ml-1">{{editItem.fileName}}</span> -
      <span class="headline mr-1">آية رقم: {{editItem.verseIndex}}</span>
    </v-card-title>
    عدد الكلمات: {{numberOfWords}}
    عدد الحروف: {{numberofLetters}}
    <v-card-text>
      <v-textarea
        v-model="editItem.verseText"
        label="حرر الآية"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['editItem', 'dialog'],
  data: () => ({
    dialogDelete: false,
    desserts: [],
    editedIndex: -1
  }),
  methods: {
    close () {
      this.$emit('close')
    },
    save () {

    }
  },
  computed: {
    numberOfWords () {
      var wordsCount = this.editItem.verseText.split(' ').length
      return wordsCount
    },
    numberofLetters () {
      var lettersCount = this.editItem.verseText.replace(/ /g, '').length
      return lettersCount
    }
  },

  watch: {
  },

  created () {
  }
}
</script>
