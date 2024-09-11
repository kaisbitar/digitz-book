<template>
  <v-card flat>
    <v-tabs
      v-model="tab"
      background-color="grey lighten-4"
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
  props: ['tabs', 'activeTab'],
  data: () => ({
    tab: 'numberOfVerses'
  }),
  computed: {},
  methods: {
    setActiveTab (activeTab) {
      this.tab = activeTab
      this.$emit('tabChanged', activeTab)
    }
  },
  watch: {
    activeTab () {
      this.setActiveTab(this.activeTab)
    }
  },
  created () {},
  mounted () {
    this.setActiveTab(this.activeTab)
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
