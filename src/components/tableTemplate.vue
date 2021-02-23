<template>
<!-- <div > -->
  <div  >
  <tr class="white" v-bind:key="index" v-for="(item, index) in verseItem">
    <td><div>{{item.bigIndx}}</div></td>
    <td><div>{{item.verseIndex}}</div></td>{{search}}
    <td><div v-html="$options.filters.highlightVerse(item.verseText, search)"></div></td>
    <td><div>{{item.NumberOfWords}}</div></td>
    <td><div>{{item.NumberOfLetters}}</div></td>
  </tr>
  </div>
<!-- </div> -->
</template>

<script>

export default {
  name: 'tabelTemplate',
  components: {
  },
  props: ['verseItem', 'search'],
  data: () => ({

  }),
  methods: { },
  created () {
  },
  mounted () {
  },
  filters: {
    highlightVerse: function (text, search) {
      if (search == null) return text
      else {
        var qurey = new RegExp(search, 'gi')
        return text.replace(qurey, match => {
          return '<span style="background:yellow accent-1 !important">' + match + '</span>'
        })
      }
    }
  }
}
</script>

<style >
</style>
