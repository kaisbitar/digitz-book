<template>
  <div  class="text-center">
    <!-- <v-col justify="center" cols="1" sm="6" md="1">
      <div  @click="showIndex=!showIndex" class="menuItem d-flex">
        <v-icon small>mdi-script-text-outline</v-icon>
        <div v-if="!showIndex" class="mr-2 subtitle-2">القائمة</div>
      </div>
    </v-col> -->
    <!-- <v-col class="mb-" cols="12"> -->
      <!-- <v-card justify="center"  > -->
          <!-- <h2 class="headline font-weight-bold">
            قائمة الكتاب
          </h2> -->
          <v-col cols="12" sm="6" md="12">
            <v-text-field
              label="ابحث عن اسم سورة أو رقماً فيها.."
              single-line
              v-model="search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        <v-data-table
          :headers="headers"
          :items="data"
          :loading="loading"
          loading-text="جاري تحميل أسماء السور"
          :search="search"
          :items-per-page="114"
          :height="400"
          fixed-header
          hide-default-footer
        >
          <template v-slot:item="props">
            <!-- create an item to fix first item index -->
            <div v-show="false">{{data.map(function(x) {return x.id; }).indexOf(props.item.suraIndex)}}</div>
            <!--  -->
            <tr
              @click="selectSura(props.item)"
              :class="{'suraSelected': props.item.suraIndex===selectedId}"
              class="font-weight-medium suraItem"
            >
              <td class="text-right">{{ props.item.suraIndex }}</td>
              <td class="text-right">{{ props.item.Name }}</td>
              <td class="text-right">{{ props.item.numberOfVerses }}</td>
              <td class="text-right">{{ props.item.NumberOfWords }}</td>
              <td class="text-right">{{ props.item.NumberOfLetters }}</td>
            </tr>
          </template>
        </v-data-table>
      <!-- </v-card> -->
    <!-- </v-col> -->
  </div>
</template>

<script>
import { fetchQuranIndex } from '@/api/api.js'

export default {
  name: 'QuraIndex',
  created () {
    const appApi = process.env.VUE_APP_API_URL
    fetchQuranIndex(appApi).then(data => {
      this.data = data
      this.loading = false
    })
  },
  data: () => ({
    data: [],
    loading: true,
    search: '',
    showIndex: false,
    selectedId: 1,
    headers:
    [
      {
        text: 'رقم',
        value: 'suraIndex',
        width: 68
      },
      {
        text: 'السورة',
        value: 'Name'
      },
      {
        text: 'الآيات',
        value: 'numberOfVerses'
      },
      {
        text: 'الكلمات',
        value: 'NumberOfWords'
      },
      {
        text: 'الحروف',
        value: 'NumberOfLetters'
      }
    ]
  }),
  methods: {
    selectSura (sura) {
      this.$store.commit('setFileName', sura.fileName)
      this.$store.commit('setTargetedVerse', null)
      this.showIndex = false
      this.selectedId = sura.suraIndex
    }
  }
}
</script>
<style scoped>

tr.suraItem{
  cursor: pointer;
}
tr.suraItem:hover{
  background: #ccc !important;
  color: #000;
}
tr.suraSelected{
  background: #676767;
  font-size: 50px;
  color: white;
}

</style>
