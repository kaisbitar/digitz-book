<template>
  <div flat class="glSearchBox d-flex">
    <span v-if="search && matchAll" class="matchLabel">تطابق</span>
    <label @click="(matchAll = !matchAll), matchChanged()">
      <v-icon
        v-if="search"
        :color="matchAll === false ? 'grey lighten-1' : 'blue'"
        class="mt-1"
      >
        mdi-format-letter-matches
      </v-icon> </label
    >
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-0 pa-0"
      clearable
    >
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'glSearchBox',
  props: ['dataType', 'inputText'],
  components: {},
  data: () => ({
    search: '',
    matchAll: false
  }),
  computed: {
    selectedSearchIndex () {
      return this.$store.getters.selectedSearchIndex
    }
  },
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
    },
    selectedSearchIndex () {
      this.matchAll = false
      this.matchChanged()
    }
  },
  created () {
    this.search = this.inputText
    this.matchAll = false
    this.matchChanged()
  },
  mounted () {},
  updated () {}
}
</script>

<style>
.glSearchBox {
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
