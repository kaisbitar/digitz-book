<template>
  <v-card
    class="suraInfoSingleBox"
    @click="selectTab(tabName)"
    :class="{ active: activeTab}"
    outlined
  >
    <div class="d-flex ma-auto">
      <span  class="ml-1 body-1">
        {{ value }}
      </span>
      {{title}}
    </div>
    </v-card
  >
</template>

<script>
export default {
  name: 'dashboardTab',
  components: {},
  props: ['activeTab', 'value', 'title', 'tabName'],
  data: () => ({

  }),
  computed: {},
  methods: {
    selectTab (tabName) {
      this.$store.commit('setActiveTab', tabName)
    }
  },
  created () {},
  mounted () {}
}
</script>

<style>
</style>
