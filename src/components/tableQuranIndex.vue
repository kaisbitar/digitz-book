<template>
  <div class="text-center">
    <div class="d-flex searchWrap mr-1">
      <v-text-field
        v-model="search"
        background-color="white"
        append-icon="mdi-magnify"
        label="سورة أو رقماً فيها.."
        clear-icon="mdi-close"
        class="mr-2 ml-2 mt-3"
        single-line
        clearable
        outlined
        dense
      ></v-text-field>
      <div class="mt-5">
        <v-icon
          :color="showDetail === false ? 'grey' : 'blue'"
          @click="
            (showDetail = !showDetail), $emit('showDetailToggle', showDetail)
          "
        >
          mdi-format-horizontal-align-center
        </v-icon>
      </div>
    </div>
    <div id="indexBlock">
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        loading-text="جاري تحميل أسماء السور"
        :search="search"
        :items-per-page="115"
        :height="'84vh'"
        fixed-header
        hide-default-footer
        class="tableStyle indexStyle"
        id="indexBlock"
      >
        <template v-slot:item="props">
          <tr
            @click="runSura(props.item)"
            :class="{ activeTableItem: props.item.fileName === fileName }"
            class="tableItem"
          >
            <td
              class="text-right"
              v-html="highlight(suraIndex(props.item.fileName), search)"
            ></td>
            <td
              class="text-right"
              v-html="highlight(suraName(props.item.fileName), search)"
            ></td>
            <td
              class="text-right"
              v-html="highlight(props.item.numberOfVerses, search)"
            ></td>
            <td
              class="text-right"
              v-html="highlight(props.item.numberOfWords, search)"
            ></td>
            <td
              class="text-right"
              v-html="highlight(props.item.numberOfLetters, search)"
            ></td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'

export default {
  name: 'tableQuranIndex',
  mixins: [appMixin],
  data: () => ({
    loading: true,
    search: '',
    showDetail: false,
    headers: [
      {
        text: 'رقم',
        value: 'suraIndex',
        width: 70
      },
      {
        text: 'السورة',
        value: 'fileName',
        width: 100
      },
      {
        text: 'الآيات',
        value: 'numberOfVerses',
        width: 90
      },

      {
        text: 'كلمات',
        value: 'numberOfWords',
        width: 90
      },

      {
        text: 'حروف',
        value: 'numberOfLetters',
        width: 90
      }
    ]
  }),
  computed: {
    data () {
      return this.$store.getters.tableQuranIndex
    },
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    suraName (fileName) {
      return fileName.replace(/[0-9]/g, '')
    },
    suraIndex (fileName) {
      if (fileName === '000المصحف') return '0'
      return parseInt(fileName, 10)
    },
    runSura (sura) {
      this.$store.commit('setTarget', {
        fileName: sura.fileName,
        verseIndex: null
      })
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
      this.$store.commit('setSearchIndex', -1)
    },
    scrollToIndex () {
      setTimeout(() => {
        this.$vuetify.goTo('.activeTableItem', {
          container: '.v-data-table__wrapper'
        })
      }, 10)
    },
    highlight (text, search) {
      if (!text) return
      if (search == null) {
        return text
      }
      if (isNaN) {
        text = text.toString()
      }
      var qurey = new RegExp(search, 'gi')
      return text.replace(qurey, (match) => {
        return '<span class="yellow accent-1">' + match + '</span>'
      })
    }
  },
  created () {
    if (!this.fileName) {
      this.loading = false
      return
    }
    this.scrollToIndex(this.fileName)
    this.loading = false
  },
  watch: {
    fileName () {
      this.scrollToIndex(this.fileName)
    },
    search () {
      if (this.search === null) {
        this.showDetail = false
        this.$emit('showDetailToggle', this.showDetail)
        return
      }
      if (!isNaN(this.search)) {
        this.showDetail = true
        this.$emit('showDetailToggle', this.showDetail)
      }
    }
  },
  mounted () {}
}
</script>
<style>
th {
  padding-top: 2px !important;
  height: 25px !important;
}
.indexStyle .tableItem  {
  font-weight: 100;
}
.tableItem {
  cursor: pointer;
  font-weight: 500;
  color: #544d4d;
  font-size: 16px !important;
}
.tableItem:hover {
  background: #0000000f !important;
  opacity: 0.7;
}
.activeTableItem, .activeTableItem2 {
  color: black !important;
  font-weight: 500 !important;
  background: #efebe9 !important;
}
.tableStyle td {
  border: none !important;
}
.tableStyle table {
  border-collapse: collapse;
  width: 100%;
}
.tableStyle tr:nth-child(even) {
  background-color: #f9f9f980;
}
.indexStyle {
  width: auto !important;
}
.searchBox {
  padding-bottom: 0px;
  margin-bottom: -21px;
}
#indexBlock .v-data-table--fixed-header > .v-data-table__wrapper {
  overflow-x: hidden !important;
  /* margin-left: -11px; */
}
.searchWrap {
  width: 220px;
  height: 66px;
}
.v-text-field__slot {
  position: initial;
}
label.v-label.theme--light {
  font-size: 14px;
  top: 10px;
}
</style>
