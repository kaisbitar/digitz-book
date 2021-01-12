<template>
  <v-card flat  class="">
{{fileName}}
  </v-card>
</template>

<script>

export default {
  name: 'suraDashbord',
  components: {
  },
  data: () => ({ }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  methods: { },
  created () {},
  mounted () { }
}
</script>

<style>
</style>
