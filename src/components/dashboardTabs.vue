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
        @click="setActiveTab(item.name)"
        :key="index"
        :title="item.title"
        :value="item.value"
        :tabName="item.name"
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
    tab: null
  }),
  computed: {},
  methods: {
    setActiveTab (activeTab) {
      this.$store.commit('setActiveTab', activeTab.name)
    }
  },
  watch: {
    tab () {
      this.$emit('tabChanged', this.tab)
      this.$store.commit('setActiveTab', this.tabs[this.tab])
    }
  },
  created () {},
  mounted () {}
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
