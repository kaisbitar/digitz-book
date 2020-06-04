<template>
  <v-card  flat :dark="isDark" class="singleSura pr-10 pt-0 pb-0">
    <h1 class=" text-center titeAndIndex ">
      سورة {{this.$store.state.fileName}}
      <!-- <v-switch v-model="isDark" label="إضاءة"></v-switch> -->
    </h1>
    <v-row class="mb-4">
      <v-col class="pb-0"  sm="3" md="1">
      <div  @click="showIndex=!showIndex" class="menuItem d-flex">
        <v-icon :class="{'activeMenu': showIndex===true}" small>mdi-format-list-bulleted</v-icon>
        <div v-show="!showIndex" class="mr-2 subtitle-2">سور</div>
      </div>
      <quranIndex v-show="showIndex"/>

      </v-col>
      <v-col class="pb-0" sm="3" md="1">
          <div  @click="showText=!showText" class="menuItem d-flex">
            <v-icon :class="{'activeMenu': showText===true}" small>mdi-text-subject</v-icon>
            <div v-if="!showText" class="mr-2 subtitle-2">نص</div>
          </div>
      </v-col>
      <v-col class="pb-0"  sm="3" md="1">
          <div  @click="showChart=!showChart" class="menuItem d-flex">
            <v-icon :class="{'activeMenu': showChart===true}" small>mdi-chart-line</v-icon>
            <div v-if="!showChart" class="mr-2 subtitle-2">رسم</div>
          </div>
      </v-col>
      <v-col class="pb-0"  sm="3" md="1">
          <div  @click="showDetail=!showDetail" class="menuItem d-flex">
            <v-icon :class="{'activeMenu': showDetail===true}" small>mdi-table-large</v-icon>
            <div v-if="!showDetail" class="mr-2 subtitle-2">تفصيل</div>
          </div>
      </v-col>
    </v-row>

<h5 class=" text-center subtitle-1">بسم الله الرحمن الرحيم</h5>
    <!-- <div class="text-center">آية {{this.$store.state.targetedVerse}} </div> -->
    <sura-detail v-show="showDetail" />
   <v-row @click="showIndex=false">
    <suraText v-show="showText" class='suraBlock'/>
    <chart v-show="showChart" />
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
    showChart: true,
    showDetail: false
  }),
  computed: { },
  methods: {
    resetTargetedVerse () {
      this.$store.state.targetedVerse = null
      this.$store.commit('setTargetedVerse', null)
    }
  },
  mounted () {
    this.$store.watch(
      state => state.fileName,
      () => {
        this.showIndex = false
      })
  }
}
</script>

<style scoped>
  .titeAndIndex{
    height: 48px;
  }
.menuItem{
  cursor: pointer;
  height: 21px;
}
.suraBlock{
  max-width: 570px;
  margin-left: auto;
  margin-right: auto;

}
.activeMenu{
  color: #2196F3;
}
</style>
