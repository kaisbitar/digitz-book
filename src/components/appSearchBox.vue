<template>
  <div flat class="appSearchBox d-flex">
    <v-text-field
      v-model="search"
      background-color="white"
      :label="'ابحث عن ' + dataType"
      append-icon="mdi-magnify"
      clearable
      outlined
      dense
    >
      <template v-slot:prepend-inner>
        <appSearchBoxMatch
          :search="search"
          :matchingStatus="matchingStatus"
          @clicked="(matchingStatus = !matchingStatus), matchChanged()"
        />
      </template>
    </v-text-field>
  </div>
</template>

<script>
import appSearchBoxMatch from './appSearchBoxMatch'

export default {
  name: 'appSearchBox',
  props: ['dataType', 'inputText'],
  components: {
    appSearchBoxMatch
  },
  data: () => ({
    search: '',
    matchingStatus: false
  }),
  computed: {
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    }
  },
  methods: {
    matchChanged () {
      this.$emit('matchChanged', [this.search, this.matchingStatus])
    }
  },
  watch: {
    search () {
      this.$emit('searchChanged', this.search)
    },
    inputText () {
      this.search = this.inputText
    },
    selectedSearchIndex () {
      this.matchingStatus = false
      this.matchChanged()
    }
  },
  created () {
    this.search = this.inputText
    this.matchingStatus = false
    this.matchChanged()
  },
  mounted () {},
  updated () {}
}
</script>

<style>
.appSearchBox {
  width: 219px;
  position: relative;
  z-index: 5;
  background: #7fffd400 !important;
}
.matchLabel {
  text-align: center;
  font-size: 10px;
  position: inherit;
  margin-left: -26px;
  margin-top: -2px;
  background: #d6d6d673;
}
.v-icon {
  cursor: pointer;
}
</style>
