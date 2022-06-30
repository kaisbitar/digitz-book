<template>
  <div class="d-lg--flex d-sm--none indexWrapper mt-n1">
    <v-chip-group
      :value="selectedVerse"
      show-arrows
      class="d-flex"
      active-class="primary--text "
      column
    >
      <v-chip
        v-for="(item, index) in items"
        :key="index"
        pill
        small
        class="grey--text darken-1"
        @click="handleClick(item)"
      >
        {{ item }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
export default {
  name: 'suraTextInfoBarIndexes',
  props: ['items', 'selectedVerse'],
  components: {},
  data: () => ({
  }),
  methods: {
    handleClick (item) {
      this.$store.commit('setTarget', { fileName: this.$store.getters.target.fileName, verseIndex: item })
    }
  },
  computed: {
  },
  watch: {
  },
  created () { },
  mounted () {}
}
</script>

<style scoped>
.indexWrapper {
  max-height: 71px;
  max-width: 483px;

}
</style>
