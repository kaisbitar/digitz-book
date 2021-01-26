<template>
  <div>
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-1 mr-10 pa-3 searchField rounded mt-1"
      background-color="grey lighten-5 mb-0"
      single-line
      hide-details
      autofocus
    ></v-text-field>
    <v-data-table
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="2000"
      :search="search"
      :height="getheight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle"
      selectable-key="selectedRow"
      fixed-header
      :group-by="groupBy"
      :loader-height=2
      single-expand
    >
      <template v-slot:[`group.header`]="{ group, isOpen=false, toggle }">
        <v-btn @click="toggle" icon small>
          <v-icon>
            {{ isOpen ? '$minus' : '$plus' }}
          </v-icon>
        </v-btn>
        كلمات ذكرت {{ group }}
      </template>

      <template v-slot:item="props">
        <tr
          @click="$emit('rowClicked',props.index, props.item)"
          :class="{ active: props.index === selectedId }"
        >
          <td class="text-right" v-html="highlight(props.item.x, search)"></td>
          <td class="text-right">{{ props.item.y }}</td>
        </tr>
      </template>

    </v-data-table>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: '',
  components: {},
  mixins: [appMixin],
  props: [
    'tableData',
    'tableHeaders',
    'search',
    'footerProps',
    'isLoading',
    'groupBy',
    'dataType',
    'selectedId'
  ],
  data: () => ({
    windowHeight: window.innerHeight
  }),
  computed: {},
  methods: {
    getheight () {
      var heightDif = this.windowHeight - 280
      return heightDif
    }
  },
  created () {
  },
  mounted () {}
}
</script>

<style>
</style>
