<template>
  <v-card flat class="glSearchBox d-flex">
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-0 pa-0 "
      background-color=""
      single-line
      hide-details
      autofocus
      clearable
    >
      <template v-slot:prepend>
        <span  @click="matchAll = !matchAll, matchChanged()"
          ><v-icon
            v-if="search"
            :color="matchAll === false ? 'grey lighten-1' : 'blue'"
            class="mt-1"
          >
            mdi-format-letter-matches
          </v-icon></span
        >
      </template>
    </v-text-field>

  </v-card>
</template>

<script>
export default {
  name: 'glSearchBox',
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
      this.$emit('matchChanged', arr)
    }
  },
  watch: {
    search () {
      this.$emit('searchChanged', this.search)
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
.glSearchBox {
  width: 219px;
  position: relative;
  z-index: 5;
  background: #7fffd400 !important;
}
</style>
