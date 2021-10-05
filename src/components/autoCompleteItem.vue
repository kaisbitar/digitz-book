<template>
  <div style="display: contents" @click="handleClick()">
    <!-- <label > -->
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
    <!-- </label> -->
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoCompleteItem',
  props: ['item', 'inputText'],
  mixins: [appMixin],
  components: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    handleClick () {
      var suraNumber = this.item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
      var suraName = this.item.fileName.replace(/[0-9]/g, '')
      var target = {
        fileName: suraNumber + suraName,
        verseIndex: this.item.verseIndex
      }
      this.$store.commit('setTarget', target)
      this.$emit('clicked')
    }
  },
  watch: {
  },
  created () {

  },
  mounted () {
  }
}
</script>

<style>
.v-autocomplete__content {
  max-width: 500px;
}
@media (max-width: 600px) {
  .v-autocomplete__content{
    max-width: -webkit-fill-available;
  }
}
</style>
