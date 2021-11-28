<template>
  <v-card outlined class="d-flex pt-2 paginationWrapper" color="grey lighten-5">
    <div class="currentItemsLength mb-2 mt-1 mr-4 ml-4">
      <span class="thisPage">هذه الصفحة: </span>
      <span class="font-weight-bold">{{ currentItemsLength }}</span>
      {{ label }}
    </div>
    <v-pagination
      v-model="pageLocal"
      :length="pageCount"
      color="brown lighten-5 black--text font-weight-bold"
      class="paginator"
    ></v-pagination>
  </v-card>
</template>

<script>
export default {
  name: 'tablePagination',
  props: ['page', 'pageCount', 'currentItemsLength', 'label'],
  components: {},
  data: () => ({
    pageLocal: 1
  }),
  computed: {},
  methods: {},
  watch: {
    pageLocal () {
      this.$emit('pageChanged', this.pageLocal)
    },
    page () {
      this.pageLocal = this.page
    }
  },
  created () {},
  mounted () {
    this.pageLocal = this.page
  }
}
</script>

<style>
ul.v-pagination.theme--light {
  zoom: 0.7;
}
.currentItemsLength {
  font-size: 14px;
}
.paginator {
  margin-top: -3px;
}
.thisPage {
  font-size: 11px;
}
</style>
