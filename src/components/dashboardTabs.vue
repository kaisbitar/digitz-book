<template>
  <v-card flat>
    <v-tabs
      v-model="tab"
      background-color=""
      color=""
      class=""
      height="37"
      grow
    >
      <v-tab
        v-for="(item, index) in tabs"
        v-model="item.name"
        :href="'#' + item.name"
        :key="index"
        @click="setActiveTab(item.name)"
        :title="item.title"
        :value="item.value"
      >
        {{item.value}} {{ item.title }}
      </v-tab>
    </v-tabs>
    </v-card
  >
</template>

<script>
export default {
  name: 'dashboardTab',
  components: {},
  props: ['tabs', 'activeTab', 'value', 'title', 'tabName'],
  data: () => ({
    tab: 'numberOfVerses'
  }),
  computed: {},
  methods: {
    setActiveTab (activeTab) {
      this.tab = activeTab
      this.$store.commit('setActiveTab', activeTab)
    }
  },
  watch: {
    activeTab () {
      this.tab = this.activeTab
    }
  },
  created () {},
  mounted () {
    this.tab = this.activeTab
  }
}
</script>

<style>
.v-tab {
  font-size: 17px;
  font-family: unset;
  letter-spacing: 0;
}
.v-tab.v-tab {
  height: 26px;
  margin-top: 5px;
}
</style>
