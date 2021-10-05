<template>
  <div class="text-center">
    <div class="d-flex searchWrap">
      <v-text-field
        class="mr-2 ml-2"
        label="سورة أو رقماً فيها.."
        single-line
        v-model="search"
        append-icon="mdi-magnify"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
      <div>
        <v-icon
          class="mt-9 ml-4"
          :color="showDetail === false ? 'grey' : 'blue'"
          @click="
            (showDetail = !showDetail), $emit('showDetailToggle', showDetail)"
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
        class="tableStyle indexStyle "
        id="indexBlock"
      >
        <template v-slot:item="props">
          <tr
            @click="selectSura(props.item)"
            :class="{ active: props.item.fileName === selectedId }"
            class="indexItem"
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
    selectedId: '001الفاتحة',
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
    selectSura (sura) {
      var target = { fileName: sura.fileName, verseIndex: null }
      this.$store.commit('setTarget', target)
      this.selectedId = sura.fileName
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
      this.$store.commit('setFilterSelectedIndex', -1)
      this.$store.commit('resetFilterSelectedSearch')
    },
    scrollToIndex () {
      setTimeout(() => {
        this.$vuetify.goTo('.active', {
          container: '.v-data-table__wrapper'
        })
      }, 10)
    },
    highlight (text, search) {
      if (!text) return
      if (search == null) {
        return text
      } if (isNaN) {
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
    this.selectedId = this.fileName
    this.scrollToIndex(this.selectedId)
    this.loading = false
  },
  watch: {
    fileName () {
      this.selectedId = this.fileName
      this.scrollToIndex(this.selectedId)
    },
    search () {
      if (this.search === null) {
        this.showDetail = false
        this.$emit('showDetailToggle', false)
        return
      } if (!isNaN(this.search)) {
        this.showDetail = true
        this.$emit('showDetailToggle', true)
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
.indexItem {
  cursor: pointer;
  font-weight: 100;
  color: #544d4d;
  font-size: 16px !important;
}
.indexItem:hover {
  background: #0000000f !important;
  opacity: 0.7;
}
.active, .active2{
  color: black !important;
  font-weight: 500 !important;
  background: #efebe9 !important;
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
.searchWrap{
  width: 220px;
}
.v-text-field__slot{
  position: initial;
}
label.v-label.theme--light{
  font-size: 14px;
  top: 10px;
}
</style>
