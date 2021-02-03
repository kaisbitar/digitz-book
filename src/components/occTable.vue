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
      :loader-height="2"
    >
      <template v-if="dataType === 'words'" v-slot:[`group.header`]="{ group, isOpen, toggle }">
        <div class="groupHeader pt-3 font-weight-bold">
          <v-btn @click="toggle" icon small :ref="'expand' + group">
            <v-icon>
              {{ isOpen ? "$minus" : "$plus" }}
            </v-icon>
          </v-btn>
          <span class="text-center"> كلمات ذكرت <span class="blue--text text--darken-3">{{ group }}</span> مرة</span>
        </div>
      </template>

      <!-- <template v-slot:item="props">
        <span
          @click="$emit('rowClicked', props.index, props.item)"
          :class="{ active: props.item.x === selectedId }"
          class="indexItem text-right pr-2"
          v-html="highlight(props.item.x + ' - ', search)"
        >
        </span>
      </template> -->
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
    'footerProps',
    'isLoading',
    'groupBy',
    'dataType',
    'selectedId'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    search: ''
  }),
  computed: {},
  methods: {
    getheight () {
      var heightDif = this.windowHeight - 310
      return heightDif
    },
    async collapseHeaders (group) {
      return new Promise((resolve) => {
        Object.keys(this.$refs).forEach((k) => {
          this.$refs[k].$el.click()
        })
        resolve()
      })
    }
  },
  created () {
    // Object.keys(this.$refs).forEach((k) => {
    //   this.$refs[k].$el.click()
    // })
  },
  mounted () {
    this.collapseHeaders()
  }
}
</script>

<style scoped>
span.indexItem.text-right.pr-2 {
  display: inline-block;
  margin-top: 5px;
  /* margin-bottom: 10px; */
}
.groupHeader {
  height: 50px;
}
.indexItem:hover {
  /* color: white; */
  /* font-weight: bold !important; */
  /* color: #5195d8; */
}
.active {
  color: #006381 !important;
  background: #ccc !important;
  font-weight: bold !important;
}
</style>
