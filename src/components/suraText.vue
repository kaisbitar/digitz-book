<template>
  <div>
    <v-card flat>
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
      <v-row v-show="true" class=" mb-n1" >
          <span class="ml-7 mt-2">
            <v-chip label class="ml-1" style="width:65px">

            آية
            {{verseNumber}}
            </v-chip>
          </span>
          <span class="d-flex" v-if="foundIndexesLength !== 0">
            <div class="mt-2">
              <v-icon @click="nextHighlight('prev')" small>mdi-arrow-right</v-icon>
            </div>
            <div class="mt-2">
              <v-icon @click="nextHighlight('next')" small>mdi-arrow-left</v-icon>
            </div>
          </span>
          <span class=" black--text ">
            <v-text-field
            class="mr-4"
            single-line
            v-model="searchedString"
            autofocus
            dense
            :label="'  ابحث في'+fileName"
            append-icon="mdi-magnify"
            @change="searchedStringIndexes()"
          ></v-text-field>
          </span>
          <div class="d-flex mt-3 mr-4 caption"  v-if="foundIndexesLength !== 0">
            <v-chip label class="ml-1">{{foundIndexesLength}} آية
            </v-chip>
          </div>
        </v-row>
    </v-row>

    <v-row class="mt-1 pa-6 grey lighten-4 pt-2" id="suraBlock" outlined>
      <div
        class="suraText "
        v-for="(item, index) in items.suraString"
        :key="index"
        :class="index-1"
        @click="handleVerseClick(index)"
      >
        <v-hover v-slot:default="{ hover }" close-delay="50">
          <div class="ma-1">
            <v-card
              class="pa-"
              v-if="showSura"
              :class="{ 'activeVerse': index+1===verseNumber, 'notActive': index+1!==verseNumber, 'normalState': verseNumber===null }"
              :color="handleHover(hover, index)"
              flat
            >
              <div :id="'v' + (index+1)" class="d-inline verse ml-2">
                <v-chip class="indigo lighten-3 white--text"  label >{{index+1}}</v-chip>
                <div v-if="searchedString" class=" d-inline" v-html="$options.filters.highlightVerse(item, searchedString)" >
                </div>
                <div v-else class="  d-inline" >
                  {{item}}
                </div>
              </div>
            </v-card>
          </div>
        </v-hover>
      </div>
    </v-row>
    <v-row justify="center">
      <v-overlay :absolute="absolute" :opacity="0" :value="isLoading">
        <v-progress-circular color="indigo" indeterminate></v-progress-circular>
      </v-overlay>
    </v-row>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { fetchSuraText } from '@/api/api.js'
import * as easeOutBounce from 'vuetify/es5/services/goto/easing-patterns'

export default {
  name: 'suraText',
  data: () => ({
    items: [],
    duration: 100,
    offset: 1000,
    easing: 'easeInOutCubic',
    easings: Object.keys(easeOutBounce),
    isActive: true,
    verseNumber: 0,
    isLoading: true,
    showSura: false,
    fileName: '',
    foundIndexes: [],
    indexPointer: 0,
    absolute: true
  }),
  components: {},
  computed: {
    searchedString () {
      var filteredLists = this.$store.state.filteredSearch[this.$store.state.selectedSearch]
      if (!filteredLists) return null
      return filteredLists.searchTerms.searchedText
    },
    searchedCount () {
      var searchedObject = this.$store.state.searchedObject
      if (searchedObject == null) return ''
      else return this.$store.state.searchedObject
    },
    options () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    },
    foundIndexesLength () {
      if (this.foundIndexes === null) return
      if (this.items.length === 0) return 0
      if (this.foundIndexes.length > 0) {
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
        // this.searchedString = this.$store.state.searchedObject.searchedText
        return items
      }).then(items => {
        this.searchedStringIndexes(items)
        this.scrollToVerse(this.verseNumber)
      })
    },
    handleHover (hover, index) {
      // hover && index + 1 !== verseNumber ? 'grey lighten-1 white--text' : ' '
      // if (index + 1 === this.verseNumber) return '#000 white--text'
      // if (hover && index + 1 !== this.verseNumber) return 'grey lighten-1 white--text'
    },
    scrollToVerse (item) {
      if (item !== null) {
        var targetedVerse = this.parseVerse(item)
        if (this.fileName === this.$store.state.fileName) {
          this.$vuetify.goTo(targetedVerse, {
            container: '#suraBlock',
            options: this.options
          })
        }
      }
    },
    parseVerse (item) {
      var target = parseInt(item)
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
      var pointer = this.indexPointer
      var indexes = this.foundIndexes
      if (type === 'next') {
        if (pointer === this.foundIndexes.length) {
          pointer = 0
          this.indexPointer = 0
          this.indexPointer++
        } else {
          this.indexPointer++
        }
        this.highlightAndScroll(indexes, pointer)
      } else {
        if (pointer === 0) {
          if (this.foundIndexes.length !== 0) {
            pointer = this.foundIndexes.length + 1
            this.indexPointer = pointer
            this.indexPointer--
            return
          } else return
        } else {
          pointer = pointer - 1
          this.indexPointer--
        }
        this.highlightAndScroll(indexes, pointer)
      }
    },
    highlightAndScroll (item, pointer) {
      this.verseNumber = item[pointer]
      // this.verseNumber = item[pointer]
      this.scrollToVerse(this.verseNumber)
    },
    resetFoundIndexes () {
      this.verseNumber = null
      this.foundIndexes = null
    },
    searchedStringIndexes (items) {
      if (this.searchedString === null) return
      if (!items) {
        items = this.items
      }
      var foundItems = []
      for (var i = 0; i <= items.suraString.length - 1; i++) {
        var check = items.suraString[i].includes(this.searchedString)
        if (check === true) {
          foundItems.push(i + 1)
        }
      }
      this.indexPointer = 0
      this.foundIndexes = foundItems
      // if (foundItems.length > 0) { this.nextHighlight('next') }
    }
  },
  filters: {
    highlightVerse: function (text, searchedString) {
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
  },
  updated () {
  },
  mounted () {
    this.$store.watch(
      state => state.targetedVerse,
      () => {
        if (this.$store.state.targetedVerse === null) {
          this.verseNumber = null
        } else {
          this.verseNumber = this.$store.state.targetedVerse
          this.scrollToVerse(this.verseNumber)
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
.verseNumber {
    width: 66px !important;
    border-radius: 4px;
    padding-right: 5px;
    padding-left: 2px;
    margin-right: -9px;
}
.v-chip.v-size--default {
  height: 17px;
}
.suraText {
  /* font-size:18px; */
  line-height: 1.8;
}
.activeVerse {
  background: yellow !important;
  color: black;
}
.activeVerse:hover{
  background: #ffff83 !important;
}
.notActive {
  /* color: #e8e6e6; */
}
.normalState {
  color: black;
  background: #f7f7f7 ;
}
#suraBlock {
  /* max-width: 800px; */
  max-height: 360px;
  overflow-y: auto;
  overflow-x: hidden;
  cursor: default;
  resize: both;
  overflow: auto;
  min-height: 200px;
}
</style>
