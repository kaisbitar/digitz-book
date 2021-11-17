<template>
  <div flat class="appSearchBoxMatch d-flex">
    <span v-if="search && matchAll" class="matchLabel mt-2">تطابق</span>
    <v-icon
      :color="matchAll === false ? 'grey lighten-1' : 'blue'"
      v-if="search"
      class="mt-1"
      @click="$emit('clicked')"
    >
      mdi-format-letter-matches
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'appSearchBoxMatch',
  props: ['search', 'matchAll'],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {

  },
  watch: {},
  created () {},
  mounted () {},
  updated () {}
}
</script>

<style>
</style>
