<template>
  <v-card flat :dark="isDark" class="singleSura">
    <v-card flat class="pb-1 suraTitle">
      <v-row class="mt-4">
        <!-- <v-col class="pb-0" sm="3" md="1"> -->
          <div
            :class="{ activeMenu: showIndex === true }"
            @click="showIndex = !showIndex"
            class="menuItem d-flex"
          >
            <v-icon :class="{ 'blue--text': showIndex === true }" small>mdi-format-list-bulleted</v-icon>
            <div class="menuItem mr-2 subtitle-2">سور</div>
          </div>
        <!-- </v-col> -->
        <!-- <v-col class="pb-0" sm="3" md="1"> -->
          <div
            :class="{ activeMenu: showText === true }"
            @click="showText = !showText"
            class="menuItem d-flex mr-4"
          >
            <v-icon small>mdi-text-subject</v-icon>
            <div class="menuItem subtitle-2">نص</div>
          </div>
        <!-- </v-col> -->
        <!-- <v-col class="pb-0" sm="3" md="1"> -->
          <div
            :class="{ activeMenu: showChart === true }"
            @click="showChart = !showChart"
            class="menuItem d-flex mr-4"
          >
            <v-icon small>mdi-chart-line</v-icon>
            <div class="menuItem mr-2 subtitle-2">رسم</div>
          </div>
        <!-- </v-col> -->
        <!-- <v-col class="pb-0" sm="3" md="1"> -->
          <div
            :class="{ activeMenu: showDetail === true }"
            @click="showDetail = !showDetail"
            class="menuItem d-flex mr-4"
          >
            <v-icon small>mdi-table-large</v-icon>
            <div class="menuItem mr-2 subtitle-2">تفصيل</div>
          </div>
        <!-- </v-col> -->
      </v-row>
    </v-card>
    <!-- <v-switch v-model="isDark" label="إضاءة"></v-switch> -->
    <v-card v-show="showIndex" class="indexWrap mr-3">
      <v-expand-transition>
        <div>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <quranIndex />
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
    <!-- <v-chip small label class="text-center">آية {{this.$store.state.targetedVerse}} </v-chip> -->
    <sura-detail v-if="showDetail" />
    <v-row @click="showIndex = false">
      <suraText v-show="showText" class="suraBlock" />
      <v-card class="ma-auto mt-7" id="chart" flat v-if="showChart">
        <v-radio-group v-model="dataType" :mandatory="false" row class="mb-n12 radios">
          <v-radio color="teal lighten-1" label="أحرف" value="NumberOfLetters"></v-radio>
          <v-radio color="blue lighten-1" label="كلمات" value="NumberOfWords"></v-radio>
        </v-radio-group>
        <chart :dataType="dataType" :seriesLable="'كلمات'" :chartOptions="chartOptions" />
      </v-card>
    </v-row>
  </v-card>
</template>

<script>
import quranIndex from '../components/quranIndex.vue'
import suraText from '../components/suraText.vue'
import chart from '../components/chart.vue'
import suraDetail from '../components/suraDetail.vue'

export default {
  name: 'App',
  components: {
    quranIndex,
    suraText,
    chart,
    suraDetail
  },
  data: () => ({
    isDark: false,
    showIndex: false,
    showText: true,
    showChart: false,
    showDetail: false,
    dataType: 'NumberOfWords',
    // chartWidth: 300,
    chartOptions: {
      // responsive: [
      //   {
      //     breakpoint: 1000,
      //     options: {
      //       plotOptions: {
      //         bar: {
      //           horizontal: false
      //         }
      //       },
      //       legend: {
      //         position: 'bottom'
      //       }
      //     }
      //   }
      // ],
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
            fontSize: '24px',
            fontFamily: '"Roboto", sans-serif !important'
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
          // offsetX: 100,
          style: {
            fontSize: '24px',
            fontFamily: '"Roboto", sans-serif !important'
          }
        },
        min: 0,
        max: undefined
      },
      colors: ['#42A5F5', '#FF8A80'],
      grid: {
        show: true,
        position: 'back',
        colors: ['#000'],
        row: {
          colors: ['#f5f5f5'],
          opacity: 0.1
        },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 20
        }
      }
    }
  }),
  computed: {},
  methods: {
    resetTargetedVerse () {
      this.$store.state.targetedVerse = null
      this.$store.commit('setTargetedVerse', null)
    }
  },
  created () {},
  mounted () {
    this.$store.watch(
      state => state.fileName,
      () => {
        this.showIndex = false
      }
    )
  }
}
</script>

<style>
.titeAndIndex {
  height: 48px;
}
.menuItem {
  cursor: pointer;
  height: 21px;
}
.suraBlock {
  /* max-width: 570px; */
  margin-left: auto;
  margin-right: auto;
  padding-left: 2em;
  padding-right: 2em;
  margin-top: 36px;
}
#chart {
  /* min-width: 400px; */
  /* margin: auto; */
  /* max-width: 720px; */
}
.suraTitle {
  /* overflow: hidden; */
  background-color: #333;
  /* position: fixed; */
  /* top: 83px; */
  width: 100%;
  z-index: 4;
  /* margin-top: -3px; */
}
.activeMenu {
  color: #2196f3 !important;
}
.radios {
  max-width: 176px;
  z-index: 1;
  position: relative;
  margin-right: 155px;
}
.row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
.menuItem {
  z-index: 1;
}
.indexWrap {
  max-width: 1060px !important;
  margin-top: 5px;
}
</style>
