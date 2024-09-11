<template>
  <div style="display: contents" @click="handleClick()">
    <v-chip label small color="" class="mt-7 ml-4 black--text brown lighten-5">
      <div> {{ chipTitle }}</div>
    </v-chip>
    <v-list-item-content>
      <v-list-item-title
        class="blue--text"
        v-html="title"
      ></v-list-item-title>
      <v-list-item-title
        style="max-width=200px !important"
        v-html="mainText"
      >
      </v-list-item-title>
      <v-list-item-subtitle
        v-html="subtitle"
      >
      </v-list-item-subtitle>
    </v-list-item-content>
  </div>
</template>

<script>

export default {
  name: 'autoCompleteItem',
  props: ['title', 'mainText', 'chipTitle', 'subtitle'],
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    handleClick () {
      this.$emit('clicked')
    }
  },
  watch: {},
  created () {},
  mounted () {}
}
</script>

<style>
.v-autocomplete__content {
  max-width: 500px;
}
.v-list-item {
  zoom: 1.2;
}

@media (max-width: 600px) {
  .v-autocomplete__content {
    max-width: -webkit-fill-available;
  }
}
</style>
