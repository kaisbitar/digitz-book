<template>
  <v-card flat class="searchBoxCollection d-flex">
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-0 pa-0 searchField"
      background-color=""
      single-line
      hide-details
      autofocus
      clearable
    >
      <template v-slot:prepend>
        <span @click="matchAll = !matchAll, matchChanged()"
          ><v-icon
            :color="matchAll === false ? 'grey lighten-1' : 'blue'"
            class="mt-1"
          >
            mdi-format-letter-matches
          </v-icon></span
        >
      </template>
    </v-text-field>
    <div>
      <v-icon
        :color="showDetail === false ? 'grey' : 'blue'"
        @click="showDetail = !showDetail, showChanged()"
        class="mt-6 mb-1 mr-3"
      >
        mdi-dots-horizontal
      </v-icon>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'searchBoxCollection',
  props: ['dataType', 'inputText'],
  components: {},
  data: () => ({
    search: '',
    matchAll: false,
    showDetail: false
  }),
  computed: {},
  methods: {
    matchChanged () {
      var arr = []
      arr[0] = this.search
      arr[1] = this.matchAll
      this.$emit('matchanged', arr)
    },
    showChanged () {
      this.$emit('showChanged', this.showDetail)
    }
  },
  watch: {
    search () {
      this.$emit('searChanged', this.search)
    },
    inputText () {
      this.search = this.inputText
    }
  },
  created () {
    this.search = this.inputText
  },
  mounted () {},
  updated () {
  }
}
</script>

<style>
.searchBoxCollection{
    width: 323px;
}
</style>
