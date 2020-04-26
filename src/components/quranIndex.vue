<template>
  <v-container>
    <v-btn @click="showIndex=!showIndex">القائمة 
      <v-icon class="mr-2" small>mdi-script-text-outline</v-icon>
    </v-btn>
    <v-row v-show="showIndex" class="text-center">
      <v-col class="mb-5" cols="12">
        <v-card justify="center">

          <v-card-title>
            <h2 class="headline font-weight-bold">
              قائمة الكتاب
            </h2>
            <v-text-field
              label="ابحث عن اسم سورة أو رقم في قائمة الكتاب"
              single-line
              class="mr-12"
              v-model="search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :item-key="suraIndex" 
            :headers="headers"
            :items="data"
            :loading="loading"
            loading-text="جاري تحميل أسماء السور"
            :search="search"
            :items-per-page="114"
            :height="300"
            fixed-header
          >
            <template v-slot:item="props">
              <!-- create an item to fix first item index -->
              <div v-show="false">{{data.map(function(x) {return x.id; }).indexOf(props.item.suraIndex)}}</div>
              <!--  -->
              <tr 
                @click="selectSura(props.item)" 
                :class="{'suraSelected': props.item.suraIndex===selectedId}" 
                class="suraItem"
              >
                <td class="text-right">{{ props.item.suraIndex }}</td>
                <td class="text-right">{{ props.item.Name }}</td>
                <td class="text-right">{{ props.item.numberOfVerses }}</td>
                <td class="text-right">{{ props.item.NumberOfWords }}</td>
                <td class="text-right">{{ props.item.NumberOfLetters }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fetchQuranIndex } from "@/api/api.js";

export default {
  name: "QuraIndex",
  created(){
    let appApi = process.env.VUE_APP_API_URL;
    fetchQuranIndex(appApi).then(data => {
      this.data = data
      this.loading = false
    });
  },
  data: () => ({
    data:[],
    loading:true,
    search: '',
    showIndex: false,
    selectedId:0,
    headers:
    [
       {
        text:'رقم',
        value: 'suraIndex',
      },
      {
        text:'السورة',
        value: 'Name',
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
  methods:{
    selectSura(sura){
      this.$store.commit('setFileName', sura.fileName)
      this.showIndex = false
      // this.$set(sura, 'selected', true)
      this.selectedId = sura.suraIndex
      console.log(this.$emit('item-selected'))
    }
  }
};
</script>
<style scoped>
tr.suraItem{
  cursor: pointer;
}
tr.suraItem:hover{
  background: #BBDEFB !important;
}
tr.suraSelected{
  background: #BBDEFB; 
  font-size: 50px;
}
</style>