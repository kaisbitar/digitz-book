<template>
  <div>
    <div
      class="suraText"
      v-for="(item, index) in items.suraString"
      :key="index"
      :class="[index - 1, { TargetedVerse: index + 1 === suraTargetedVerse }]"
    >
      <div ref="vDiv" :id="'v' + (index + 1)" class="d-inline ml-2">
        <v-chip
          class="numChip"
          label
          :class="[{ 'grey white--text': index + 1 === suraTargetedVerse }]"
        >
          {{ index + 1 }}
        </v-chip>
        <div
          v-if="inputText"
          class="d-inline"
          v-html="$options.filters.highlightVerse(item, inputText)"
        ></div>
        <div v-else class="d-inline">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'suraTextBox',
  props: ['items', 'inputText', 'suraTargetedVerse', 'isLoading'],
  components: {},
  mixins: [appMixin],
  data: () => ({}),
  methods: {
    scrollToVerse (timeOut) {
      if (!this.suraTargetedVerse) {
        var verse = this.prepareToScroll(1)
      } else {
        verse = this.prepareToScroll(this.suraTargetedVerse)
      }
      setTimeout(() => {
        this.$vuetify.goTo(verse, {
          container: '#suraBlock',
          offset: 0,
          options: this.scrollOptions
        })
      }, timeOut)
    },
    scrollOptions () {
      return {
        duration: 0,
        easing: 'easingIn'
      }
    },
    searchDuplicates () {
      if (this.inputText == null) return null
      if (this.inputText.length >= 3) {
        var duplicates = 0
        var results = this.$refs.autocomplete.filteredItems
        results.map((item) => {
          var matches = item.verseText.match(new RegExp(this.search, 'gi'))
          if (matches !== null) {
            duplicates = matches.length - 1
          }
        })
      } else {
        duplicates = 0
      }
      return duplicates
    }
  },
  computed: {
    scrollTrigger () {
      return this.$store.state.scrollTrigger
    }
  },
  watch: {
    scrollTrigger () {
      this.scrollToVerse(0)
    },
    suraTargetedVerse () {
      this.scrollToVerse(0)
    }
  },
  filters: {
    highlightVerse: function (text, value) {
      if (value == null) return text
      else {
        var qurey = new RegExp(value, 'gi')
        return text.replace(qurey, (match) => {
          return '<span class="orange accent-1">' + match + '</span>'
        })
      }
    }
  },
  created () {},
  mounted () {
    this.scrollToVerse(1500)
  },
  updated () {}
}
</script>

<style>
.suraText {
  padding: 5px !important;
  background: white;
  margin: 1px;
  display: -webkit-inline-box;
  border-radius: 4px;
}
.numChip {
  /* brown lighten-5 */
  background: #efebe9;
  margin-left: 6px;
  padding-right: 12px;
  padding-left: 12px;
}
.TargetedVerse {
  /* yellow accent-1 */
  background: #ffff8d;
}
.TargetedChip {
  color: white !important;
  /* grey darken-1 */
  background: #757575 !important;
}
</style>
