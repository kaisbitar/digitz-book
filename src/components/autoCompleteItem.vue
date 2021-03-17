<template>
  <div style="display: contents">
    <v-checkbox class="mt-6" v-model="checked" @change="toggleChecked()"></v-checkbox>
    <template @click="handleClick()">
      <v-chip
        label
        small
        color=""
        class="mt-7 ml-4 black--text brown lighten-5"
      >
        <div>آية {{ item.verseIndex }}</div>
      </v-chip>
      <v-list-item-content>
        <v-list-item-title
          class="blue--text"
          v-html="highlight(item.fileName, inputText)"
        ></v-list-item-title>
        <v-list-item-title
          style="max-width=200px !important"
          v-html="highlight(item.verseText, inputText)"
        >
        </v-list-item-title>
        <v-list-item-subtitle
          v-html="
            'ترتيب في المصحف:' +
            highlight(item.verseNumberToQuran.toString(), inputText)
          "
        >
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoCompleteItem',
  props: ['item', 'inputText', 'selectedVerses'],
  mixins: [appMixin],
  components: {},
  data: () => ({
    checked: false
  }),
  computed: {},
  methods: {
    handleClick () {
      var target = {
        fileName: this.item.fileName,
        verseIndex: this.item.verseIndex
      }
      this.$store.commit('setTarget', target)
    },
    toggleChecked () {
      if (this.checked) {
        this.$emit('selected')
        return
      }
      this.$emit('deselected')
    }
  },
  watch: {
    // selectedVerses () {
    //   this.selectedVerses.map((index) => {
    //     if (index === this.item.verseNumberToQuran) {
    //       this.checked = true
    //       return
    //     }
    //     this.checked = false
    //   })
    // }
  },
  created () {

  },
  mounted () {
    this.selectedVerses.map((index) => {
      if (index === this.item.verseNumberToQuran) {
        this.checked = true
        return
      }
      this.checked = false
    })
  }
}
</script>

<style>
.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
  max-width: 500px;
}
</style>
