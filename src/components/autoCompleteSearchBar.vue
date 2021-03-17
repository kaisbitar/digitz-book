<template>
  <div class="d-flex">
    <v-chip-group
      class="autoChips grey--text"
      mandatory
      show-arrows
      active-class="primary--text"
    >
      <label v-for="(item, index) in filteredSearch" :key="index">
        <label :class="getClass(index)">
          <div class="d-flex labelsHolder mr-3 ">
            <span class="blue white--text pl-1 pr-1 ml-2">{{item.resultsCount}}</span>
            <span class="green white--text pl-1 pr-1" v-if="item.parentSearch" v-html="suraName(item.parentSearch)"></span>
          </div>
          <v-chip
            @click.prevent="handleClick(index, item)"
            @click:close="removeChip(index)"
            close
            close-label
          >
            {{ item.inputText }}
          </v-chip>
        </label></label
      >
    </v-chip-group>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'autoCompleteSearchBar',
  props: ['data'],
  mixins: [appMixin],
  components: {},
  data: () => ({}),
  methods: {
    handleClick (index, item) {
      if (this.$router.currentRoute.name !== 'search') {
        this.$router.push({ name: 'search' })
      }
      this.$store.commit('setFilterSelectedIndex', index)
      this.$store.commit('setFilterSelectedSearch', this.selectedFilterList)
    },
    removeChip (index) {
      this.$store.commit('removeFilteredItem', index)
      this.$store.commit('setFilterSelectedIndex', index - 1)
      this.$store.commit('setFilterSelectedSearch', this.selectedFilterList)
    },
    getClass (index) {
      if (index === this.selectedSearchIndex) return 'activeChip'
      return 'notActive'
    },
    suraName (fileName) {
      if (!fileName) return
      return fileName.replace(/[0-9]/g, '')
    }
  },
  computed: {
    filteredSearch () {
      if (this.$store.getters.filteredSearch === null) return
      var filteredSearch = this.$store.getters.filteredSearch
      return filteredSearch
    },
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    },
    selectedFilterList () {
      return this.filteredSearch[this.selectedSearchIndex]
    }
  },
  watch: {},
  created () {},
  mounted () {}
}
</script>

<style>
.autoChips .v-chip__content {
  font-size: 16px;
}
.notActive {
  /* background: rgba(128, 128, 128, 0.212) !important; */
  opacity: 0.5;
}
span.v-badge.theme--light {
  padding-right: 6px;
  margin-bottom: 12px;
}
.labelsHolder{
  width:max-content;
  font-size: 10px;
  position: absolute;
    z-index: 1;
}
</style>
