<template>
  <v-row>
    <v-card class="versesTable" flat>
      <cTable
      :tableData="tableData"
      :headers="tableHeaders"
      :dataType="tableDataType"/>
    </v-card>
    <v-card class="ma-auto mt-2" flat>
      <chart
      :dataType="dataType"
      :seriesLable="seriesLable"
      :chartOptions="chartOptions"/>
    </v-card>
  </v-row>
</template>

<script>

import cTable from '../components/table.vue'
import chart from '../components/chart.vue'
import { fetchTableData } from '@/api/api.js'

export default {
  components: {
    cTable,
    chart
  },

  data: () => ({
    drawer: false,
    tableData: [],
    tableHeaders: [
      { text: 'رقم', value: 'verseIndx', class: 'grey   lighten-2 ' },
      { text: 'مصحف', value: 'bigIndx', class: 'grey   lighten-2' },
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2' },
      { text: 'كلمات', value: 'NumberOfWords', class: 'grey   lighten-2' },
      { text: 'أحرف', value: 'NumberOfLetters', class: 'grey   lighten-2' }
    ],
    dataType: 'NumberOfLetters',
    tableDataType: 'verses-basics',
    seriesLable: 'أحرف سيريز',
    chartOptions: {
      fill: {
        type: 'pattern',
        pattern: {
          style: 'verticalLines',
          width: 1,
          height: 3
        }
      },
      // theme: {
      //   palette: 'palette2',
      //   mode: 'light'
      // },
      stroke: {
        curve: 'smooth',
        width: 1,
        colors: ['#000']
      },
      xaxis: {
        title: {
          text: 'آيات',
          // offsetX: 0,
          // offsetY: 0,
          style: {
            fontSize: '24px', fontFamily: '"Roboto", sans-serif !important'
          }
        },
        min: 1,
        max: undefined
      },
      markers: {
        size: [4, 7]
      },
      yaxis: {
        title: {
          // offsetX: -70,
          style: {
            fontSize: '24px', fontFamily: '"Roboto", sans-serif !important'
          }
        },
        min: 0,
        max: undefined
      },
      colors: ['#42A5F5', '#FF8A80']
      // grid: {
      //   show: true,
      //   position: 'back',
      //   colors: ['#000'],
      //   row: {
      //     colors: ['#f5f5f5'],
      //     opacity: 0.4
      //   },
      //   padding: {
      //     top: 10,
      //     right: 10,
      //     bottom: 10,
      //     left: 20
      //   }
      // }
    }
  }),
  methods: {
    fetchData () {
      this.isLoading = true
      const appApi = process.env.VUE_APP_API_URL
      fetchTableData(appApi, this.$store.state.fileName, this.tableDataType).then(items => {
        this.fileName = this.$store.state.fileName
        this.isLoading = false
        this.tableData = items
        return this.tableData
      })
    }
  },
  mounted () {
    // this.chartWidth = document.getElementById('chart').clientWidth
    this.$store.watch(
      state => state.fileName,
      () => {
        this.fetchData()
      })
  },
  created () {
    this.fetchData()
  }
}
</script>

<style  scoped>
.versesTable{
  max-width: 570px;
  margin-left: auto;
  margin-right: auto;
}
#chart{
  /* min-width: 360px; */
  /* margin: auto; */
  /* width: 720px; */
}
</style>
