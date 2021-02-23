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
          mdi-dots-horizontal
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
    <!-- </v-card> -->
    <!-- </v-col> -->
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
    selectedId: 1,
    showDetail: false,
    headers: [
      {
        text: 'رقم',
        value: 'suraIndex',
        width: 70
      },
      {
        text: 'السورة',
        value: 'name',
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
      return this.$store.state.target.fileName
    }

  },
  methods: {
    suraName (fileName) {
      fileName = fileName.replace(/[0-9]/g, '')
      return fileName
    },
    suraIndex (fileName) {
      if (fileName === '000المصحف') return '0'
      var suraNumber = parseInt(fileName, 10)
      return suraNumber
    },
    selectSura (sura) {
      var target = { fileName: sura.fileName, verseIndex: null }
      this.$store.commit('setTarget', target)
      this.selectedId = sura.fileName
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    scrollToIndex () {
      setTimeout(() => {
        this.$vuetify.goTo('.active', {
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
    if (this.fileName !== this.$store.state.fileName) {
      this.selectedId = this.$store.state.target.fileName
      this.scrollToIndex(this.selectedId)
      this.loading = false
    }
  },
  watch: {
    fileName () {
      this.selectedId = this.$store.state.target.fileName
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
  /* background: white !important; */
  font-weight: 100;
  color: #a9a9a9;
}
.indexItem:hover {
  background: #0000000f !important;
  opacity: 0.7;
}
.active:hover {
  font-weight: 100 !important;
}
.active {
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
