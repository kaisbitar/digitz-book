<template>
  <v-container>
    <v-row>
      <div class="d-flex mt-3" style="width:403px">
        <div>
          <div class="d-none">{{this.$store.state.targetedVerse}}</div>
          <strong>آيات:</strong>
          {{items.numberOfVerses}}
        </div>
        <div class="mr-4">
          <strong>كلمات:</strong>
          {{items.numberOfWords}}
        </div>
        <div class="mr-4">
          <strong>أحرف:</strong>
          {{items.numberOfLetters}}
        </div>
      </div>
      <v-row v-show="true" class=" mb-n1">
          <div class="mt-2"><v-icon @click="nextHighlight('prev')" small>mdi-arrow-right</v-icon></div>
          <div class="mt-2"><v-icon @click="nextHighlight('next')" small>mdi-arrow-left</v-icon></div>
          <span class=" black--text ">
            <v-text-field
            class="mr-4"
            single-line
            v-model="searchedString"
            autofocus
            dense
            background-color="#efefef"
            :label="'  ابحث في'+fileName"
            append-icon="mdi-magnify"
            @keydown="resetFoundIndexes()"
          ></v-text-field>
          </span>
          <div class="d-flex mt-3 mr-4 caption"  v-if="foundIndexesLength !== 0">
            <v-chip label class="ml-1">
              {{foundIndexesLength}}
            </v-chip>
            آية
              {{verseNumber}}

             <!-- {{fileName}} -->
            <!-- <v-chip label class="mr-3 ml-1">
              {{searchedCount}}
            </v-chip>
            مصحف -->
          </div>
        </v-row>
    </v-row>

    <v-row class="mt-1 pa-6 grey lighten-2 pt-2" id="suraBlock" outlined>
      <div
        class="suraText "
        v-for="(item, index) in items.suraString"
        :key="index"
        :class="index-1"
        @click="handleVerseClick(index)"
      >
        <v-hover v-slot:default="{ hover }" close-delay="50">
          <div>
            <v-card
              v-if="showSura"
              :color="hover ? 'grey lighten-1 white--text' : ' '"
              :class="{ 'activeVerse': index+1===verseNumber, 'notActive': index+1!==verseNumber, 'normalState': verseNumber===null }"
              flat
            >
              <div :id="'v' + (index+1)" class="d-inline verse ml-2">
                <div class=" d-inline blue--text subtitle-2 mb-8 mr-n1">*</div>
                <div class=" d-inline mb-8">{{index+1}}- </div>
                <div class=" d-inline" v-html="$options.filters.highlightText(item, searchedString)" >
                </div>
              </div>
            </v-card>
          </div>
        </v-hover>
      </div>
      <v-overlay :absolute=true :opacity=".5" :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { fetchSuraText } from '@/api/api.js'
import * as easings from 'vuetify/es5/services/goto/easing-patterns'

export default {
  name: 'suraText',
  data: () => ({
    items: [],
    duration: 0,
    offset: 0,
    easing: 'easeInOutCubic',
    easings: Object.keys(easings),
    isActive: true,
    verseNumber: 0,
    isLoading: true,
    showSura: false,
    fileName: '',
    searchedString: null,
    foundIndexes: []
  }),
  components: {},
  computed: {
    searchedCount () {
      var searchedObject = this.$store.state.searchedObject
      if (searchedObject == null) return ''
      else return this.$store.state.searchedObject.resultsCount
    },
    options () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    },
    foundIndexesLength () {
      if (this.foundIndexes !== null) {
        return this.foundIndexes.length
      } else return 0
    },
    selectedVerse () {
      var selectedVerse = this.verseNumber
      return selectedVerse
    }
  },
  methods: {
    fetchSura () {
      this.isLoading = true
      this.showSura = false
      const appApi = process.env.VUE_APP_API_URL
      fetchSuraText(appApi, this.$store.state.fileName).then(items => {
        this.resetFoundIndexes()
        this.fileName = this.$store.state.fileName
        this.items = items
        this.isLoading = false
        this.showSura = true
        this.verseNumber = this.$store.state.targetedVerse
        this.searchedString = this.$store.state.searchedObject.searchedString
      })
    },
    scrollToVerse (verseNumber) {
      if (verseNumber !== null) {
        var targetedVerse = this.parseVerse(verseNumber)
        if (this.fileName === this.$store.state.fileName) {
          this.$vuetify.goTo(targetedVerse, {
            container: '#suraBlock',
            options: this.options
          })
        }
      }
    },
    parseVerse (verseNumber) {
      var target = parseInt(verseNumber)
      if ((target < 0)) {
        return null
      } else {
        const value = '#v' + target
        return value
      }
    },
    handleVerseClick (index) {
      if (this.verseNumber !== null) {
        this.verseNumber = null
      } else this.verseNumber = index + 1
    },
    nextHighlight (type) {
      if (this.foundIndexes === null) {
        this.foundIndexes = this.searchedStringIndexes()
        this.indexPointer = 0
      }
      var indexCount = this.foundIndexes.length
      if (this.indexPointer === indexCount - 1) {
        this.indexPointer = 0
        this.highlightAndScroll()
        return
      }
      if (type === 'next') {
        this.indexPointer = this.indexPointer + 1
        this.highlightAndScroll()
      } else {
        if (this.indexPointer === 1) {
          this.indexPointer = this.foundIndexes[indexCount]
        } else {
          this.indexPointer = this.indexPointer - 1
          this.highlightAndScroll()
        }
      }
    },
    highlightAndScroll () {
      this.verseNumber = this.foundIndexes[this.indexPointer]
      this.verseNumber = this.foundIndexes[this.indexPointer]
      this.scrollToVerse(this.verseNumber)
    },
    resetFoundIndexes () {
      this.verseNumber = null
      this.foundIndexes = null
    },
    searchedStringIndexes () {
      this.foundIndexes = []
      this.items.suraString.map(
        (item, index) => {
          var check = item.includes(this.searchedString)
          if (check === true) {
            this.foundIndexes.push(index + 1)
          }
        }
      )
      return this.foundIndexes
    }
  },
  filters: {
    highlightText: function (text, searchedString) {
      if (searchedString == null) return text
      else {
        var qurey = new RegExp(searchedString, 'gi')
        return text.replace(qurey, match => {
          return '<span style="background:orange !important">' + match + '</span>'
        })
      }
    }
  },
  created () {
    this.resetFoundIndexes()
    this.fetchSura()
    this.verseNumber = this.$store.state.targetedVerse
    // this.scrollToVerse(this.$store.state.targetedVerse)
  },
  updated () {
    if (this.$store.state.targetedVerse !== null) {
      this.scrollToVerse(this.verseNumber)
    }
    if (this.indexPointer === undefined) {
      this.scrollToVerse(this.verseNumber)
    }
  },
  mounted () {
    this.$store.watch(
      state => state.targetedVerse,
      () => {
        if (this.$store.state.targetedVerse === null) {
          this.verseNumber = null
        } else {
          this.verseNumber = this.$store.state.targetedVerse
        }
      }
    )
    this.$store.watch(
      state => state.fileName,
      () => {
        this.fetchSura()
      })
  }
}
</script>
<style scoped>
.v-chip.v-size--default {
  height: 17px;
}
.suraText {
  /* font-size:18px; */
  line-height: 1.8;
}
.activeVerse {
  background: yellow;
  /* color: ; */
}
.notActive {
  /* color: #e8e6e6; */
}
.normalState {
  color: black;
  background: #e0e0e0;
}
#suraBlock {
  max-width: 800px;
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  cursor: default;
}
</style>
