<template>
  <v-card
    class="suraInfoSingleBox"
    @click="$emit('selected')"
    :class="{ active: active}"
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
  props: ['active', 'value', 'title'],
  data: () => ({}),
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style>
</style>
