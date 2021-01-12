<template>
  <div class="text-center"  >
    <v-col cols="12" sm="6" md="12" class="searchBox">
      <v-text-field
        label="ابحث عن اسم سورة أو رقماً فيها.."
        single-line
        v-model="search"
        append-icon="mdi-magnify"
      ></v-text-field>
    </v-col>
    <div id="indexBlock">
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        loading-text="جاري تحميل أسماء السور"
        :search="search"
        :items-per-page="114"
        :height="'84vh'"
        fixed-header
        hide-default-footer
        class=""
        id="indexBlock"
      >
        <template v-slot:item="props">
          <!-- create an item to fix first item index -->
          <div v-show="false">
            {{
              data
                .map(function (x) {
                  return x.id;
                })
                .indexOf(props.item.suraIndex)
            }}
          </div>
          <!--  -->
          <tr
            @click="selectSura(props.item)"
            :class="{ suraSelected: props.item.suraIndex === selectedId }"
            class="font-weight-medium indexItem"
          >
            <td class="text-right">{{ props.item.suraIndex }}</td>
            <td class="text-right" v-html="highlight(props.item.Name, search)"></td>
            <td class="text-right">{{ props.item.numberOfVerses }}</td>
            <td class="text-right">{{ props.item.NumberOfWords }}</td>
            <td class="text-right">{{ props.item.NumberOfLetters }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <!-- </v-card> -->
    <!-- </v-col> -->
  </div>
</template>

<script>
import { fetchQuranIndex } from '@/api/api.js'
import { appMixin } from '../mixins/mixins'

export default {
  name: 'QuranIndex',
  mixins: [appMixin],
  data: () => ({
    loading: true,
    search: '',
    selectedId: 1,
    headers: [
      {
        text: 'رقم',
        value: 'suraIndex',
        width: 70
      },
      {
        text: 'السورة',
        value: 'Name',
        width: 100
      },
      {
        text: 'الآيات',
        value: 'numberOfVerses',
        width: 90
      },
      {
        text: 'الكلمات',
        value: 'NumberOfWords',
        width: 100
      },
      {
        text: 'الحروف',
        value: 'NumberOfLetters',
        width: 90
      }
    ]
  }),
  computed: {
    data () {
      return this.$store.getters.quranIndex
    },
    fileName () {
      return this.$store.state.target.fileName
    }
  },
  methods: {
    selectSura (sura) {
      var target = { fileName: sura.fileName, verseIndex: null }
      this.$store.commit('setTarget', target)
      this.selectedId = sura.suraIndex
      this.search = ''
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    updateIndex (fileName) {
      var suraNumber = parseInt(fileName, 10)
      this.selectedId = suraNumber
    },
    scrollToIndex (suraNumber) {
      setTimeout(() => {
        this.$vuetify.goTo('.suraSelected', {
          container: '.v-data-table__wrapper',
          options: this.scrollOptions
        })
      }, 10)
    },
    scrollOptions () {
      return {
        duration: 1,
        offset: 2,
        easing: 'easing'
      }
    },
    highlight (text, search) {
      if (search == null) {
        return text
      } else {
        text = text.toString()
        var qurey = new RegExp(search, 'gi')
        return text.replace(qurey, (match) => {
          return (
            '<span class="orange">' + match + '</span>'
          )
        })
      }
    }
  },
  created () {
    const appApi = process.env.VUE_APP_API_URL
    fetchQuranIndex(appApi).then((data) => {
      this.$store.commit('setQuranIndex', data)
      this.loading = false
    })
    if (this.fileName !== this.$store.state.fileName) {
      this.updateIndex(this.$store.state.target.fileName)
      this.scrollToIndex(this.selectedId)
    }
  },
  watch: {
    fileName () {
      this.updateIndex(this.$store.state.target.fileName)
      this.scrollToIndex(this.selectedId)
    },
    mounted () { }
  }
}
</script>
<style>
th {
  padding-top: 2px !important;
  height: 25px !important;
}
tr.indexItem {
  cursor: pointer;
}
tr.indexItem:hover {
  background: #ccc !important;
  color: #000;
}
tr.suraSelected {
  /* brown lighten-5
  */
  background: #EFEBE9 ;
  font-size: 50px;
  font-weight: bold !important;
  color: black;
}
.searchBox {
  padding-bottom: 0px;
  margin-bottom: -21px;
}
#indexBlock .v-data-table--fixed-header > .v-data-table__wrapper{
    overflow-x: hidden !important;
}
</style>
