<template>
  <div style="display: contents" @click="handleClick()">
    <v-chip label small color="" class="mt-7 ml-4 black--text brown lighten-5">
      <div >آية {{ item.verseIndx }}</div>
    </v-chip>
    <v-list-item-content>
      <v-list-item-title
        class="blue--text"
        v-html="highlight(item.sura, inputText)"
      ></v-list-item-title>
      <v-list-item-title
        style="max-width=200px !important"
        v-html="highlight(item.verseText, inputText)"
      >
      </v-list-item-title>
      <v-list-item-subtitle>
        ترتيب في المصحف: {{ item.verseNumberToQuran }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoCompleteList',
  props: ['item', 'inputText'],
  mixins: [appMixin],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    handleClick () {
      var target = { fileName: this.item.sura, verseIndex: this.item.verseIndx }
      this.$store.commit('setTarget', target)
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    }
  },
  created () {},
  mounted () {}
}
</script>

<style>
.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active.v-autocomplete__content {
  max-width: 500px;
}
</style>
