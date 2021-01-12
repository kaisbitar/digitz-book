<template>
  <v-chip-group
    mandatory
    show-arrows
    active-class="primary--text"
  >
    <v-chip
      v-for="(item, index) in filteredSearch"
      :key="index"
      :class="getClass(index)"
      class="grey--text"
      @click.prevent="handleClick(index)"
      @click:close="removeChip(index)"
      close
      close-label
      :color="''"
    >
      {{ item.inputText }} - {{ item.resultsCount }}
    </v-chip>
  </v-chip-group>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoCompleteSearchBar',
  props: ['data'],
  mixins: [appMixin],
  components: {},
  methods: {
    handleClick (index) {
      this.$store.commit('setFilterSelectedIndex', index)
      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
    },
    removeChip (index) {
      this.$store.commit('removeFilteredItem', index)
      this.$store.commit('resetFilterSelectedIndex', index)
    },
    getClass (index) {
      // if (index === this.filterSelectedIndex) {
      //   return 'activeChip'
      // } else {
      //   return 'notActive'
      // }
    }
  },
  data: () => ({}),
  computed: {
    filteredSearch () {
      if (this.$store.getters.filteredSearch === null) return
      var filteredSearch = this.$store.getters.filteredSearch
      return filteredSearch
    },
    filterSelectedIndex () {
      return this.$store.getters.filterSelectedIndex
    }
  },
  watch: {},
  created () {
    // if (this.$router.currentRoute.name !== 'search') {
    //   this.$router.push({ name: 'search' })
    // }
  },
  mounted () {}
}
</script>

<style>
.activeChip {
  /* grey darken-1 */
  background: #757575 !important;
  color: white !important;
}
button.v-icon.notranslate.v-chip__close.v-icon--link.v-icon--right.mdi.mdi-close-circle.theme--light {
    color: #c2c2c2;
}
button.v-icon.notranslate.v-chip__close.v-icon--link.v-icon--right.mdi.mdi-close-circle.theme--light:hover {
    color: #7b7d80;
}
/*active */
.v-chip--active button.v-icon.notranslate.v-chip__close.v-icon--link.v-icon--right.mdi.mdi-close-circle.theme--light {
    color: #7b7d80;
}
.v-chip--active button.v-icon.notranslate.v-chip__close.v-icon--link.v-icon--right.mdi.mdi-close-circle.theme--light:hover {
    color: #7b7d80;
}
span.grey--text.v-chip.v-chip--clickable.v-chip--no-color.v-chip--removable.theme--light.v-size--default:hover {
    background: #bbbbbb;
    color: white !important;
}
</style>
