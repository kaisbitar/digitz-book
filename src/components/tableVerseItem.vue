<template>
  <td
    @click="$emit('itemClicked')"
    class="text-right"
    v-html="highlight(cellItem, search)"
  ></td>
</template>

<script>
export default {
  name: 'tableVerseItem',
  props: ['cellItem', 'search'],
  data: () => ({}),
  computed: {},
  methods: {
    highlight (text, searchValue) {
      if (!searchValue) {
        return text
      }
      return text.replace(new RegExp(searchValue, 'gi'), (match) => {
        return '<span style="background:yellow; font-weight: bold;">' + match + '</span>'
      })
    }
  },
  created () {},
  mounted () { }
}
</script>

<style>
</style>
