<template>
  <!-- <v-card> -->
  <v-row flat class="mt-n3">
    <v-card flat class="titleWrap">
      <h1 class="mr-2 ml-3">سورة {{ fileName }}</h1>

      <div class="d-flex">
        <suraTextInfoBasic
          class="suraTextInfoBasic"
          :numberOfVerses="numberOfVerses"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
        />
        <div class="arrowsWrap">
          <div class="ml-4">
            <v-icon @click="handleSuraArrowClick('up')">mdi-chevron-up</v-icon>
          </div>
          <div>
            <v-icon @click="handleSuraArrowClick('down')">mdi-chevron-down</v-icon>
          </div>
        </div>
      </div>

      <h5 class="basmaleh">بسم الله الرحمن الرحيم</h5>
    </v-card>

    <v-row class="mt-2 selectsWrap ">
      <div class="pillsWrap ">
        <div v-if="selectedVerse" class="elevation-0 ">
        <v-chip pill small class="yellow accent-1 selectedChip mb-1">
          آية: {{ selectedVerse }}
        </v-chip>
      </div>

      <div v-if="inputText" class="elevation-0 ">
        <v-chip pill small class="orange accent-1 selectedText">
          {{ inputText }}
        </v-chip>
      </div>
      </div>

      <div class="indexesArrwosWrap" v-if="inputText">
        <div class="counts">
          {{ SelectedVerseIndex }}/{{ foundIndexesCount }}
        </div>
        <div class="mt-1 indexArrows">
          <v-icon small @click="handleArrowClick('up')">mdi-chevron-up</v-icon>
          <v-icon small @click="handleArrowClick('down')">mdi-chevron-down</v-icon>
        </div>
      </div>

      <suraTextInfoBarIndexes
      class="versesIndexes"
        :items="foundIndexesArr"
        :selectedVerse="SelectedVerseIndex"
      />
    </v-row>
  </v-row>
</template>

<script>
import suraTextInfoBasic from './suraTextInfoBasic'
import suraTextInfoBarIndexes from './suraTextInfoBarIndexes'

export default {
  name: '',
  components: { suraTextInfoBasic, suraTextInfoBarIndexes },
  props: [
    'numberOfVerses',
    'numberOfWords',
    'numberOfLetters',
    'selectedVerse',
    'inputText',
    'items'
  ],
  data: () => ({
    foundIndexes: null,
    selectedIndex: 0
  }),
  computed: {
    fileName () {
      return this.$store.state.target.fileName
    },
    foundIndexesCount () {
      if (!this.foundIndexes) return
      return this.foundIndexes.length
    },
    foundIndexesArr () {
      if (!this.foundIndexes) return
      return this.foundIndexes
    },
    SelectedVerseIndex () {
      return this.selectedIndex
    }
    // targetedVerse () {
    //   return this.$store.getters.target.verseIndex
    // }
  },
  watch: {
    items () {
      this.findInputTextIndexes()
    }
    // targetedVerse () {
    //   this.findInputTextIndexes()
    // }
  },
  methods: {
    findInputTextIndexes () {
      var array = []
      if (!this.items.suraString) return
      this.items.suraString.map((verse, index) => {
        if (verse.indexOf(this.inputText) > -1) {
          array[index] = index + 1
        }
      }, 0)
      var value = array.filter(function (el) {
        return el != null
      })
      this.foundIndexes = value
      this.setSelectedIndex()
    },
    setSelectedIndex (direction) {
      if (!this.foundIndexes) return
      var index = this.foundIndexes.indexOf(this.selectedVerse)
      if (direction === 'up') {
        this.selectedIndex = index - 1
      } else {
        this.selectedIndex = index + 1
      }
    },
    handleArrowClick (direction) {
      if (this.foundIndexesArr.length === 1) {
        this.$store.commit('setScrollTrigger')
      }
      var nextSelectedVerse = null
      this.foundIndexesArr.map((value, index, el) => {
        if (value === this.$store.getters.target.verseIndex) {
          if (direction === 'down') {
            nextSelectedVerse = el[index + 1]
            return
          }
          nextSelectedVerse = el[index - 1]
        }
      })
      this.commitVerseIndex(nextSelectedVerse, direction)
      this.setSelectedIndex(direction)
    },
    commitVerseIndex (value, direction) {
      if (value) {
        var target = { fileName: this.fileName, verseIndex: value }
        this.$store.commit('setTarget', target)
        return
      }
      if (direction === 'down') {
        target = {
          fileName: this.fileName,
          verseIndex: this.foundIndexesArr[0]
        }
        this.$store.commit('setTarget', target)
        return
      }
      target = {
        fileName: this.fileName,
        verseIndex: this.foundIndexesArr[this.foundIndexesArr.length - 1]
      }
      this.$store.commit('setTarget', target)
    },
    handleSuraArrowClick (direction) {
      if (direction === 'up') {
        var targetrSura = {
          fileName: this.$store.state.quranIndex[
            this.$store.state.target.suraNumber - 2
          ].fileName
        }
        this.$store.commit('setTarget', targetrSura)
        return
      }
      targetrSura = {
        fileName: this.$store.state.quranIndex[
          this.$store.state.target.suraNumber
        ].fileName
      }
      this.$store.commit('setTarget', targetrSura)
    }
  },
  created () {
    // this.findInputTextIndexes()
  },
  mounted () {
    this.findInputTextIndexes()
  }
}
</script>

<style>
.selectedChip {
  border: 1px solid #000;
  width: 62px;
  height: 29px !important;
  margin-left: 6px;
}
.selectedText {
  height: 29px !important;
  margin-left: 6px;
}

.inputText {
  font-size: 15px;
  margin-bottom: 2px;
  margin-top: 2px;
  padding-top: 2px;
}
.suraTextInfoBasic {
  margin-right: 16px;
}
h5.basmaleh {
  /* margin-top: 0px; */
  margin-right: 12px;
  margin-bottom: 1px;
}
.titleWrap {
  min-width: 302px;
  /*grey*/
  /* border: 1px solid #9e9e9e !important; */
}
.arrowsWrap {
  margin-right: 20px;
  margin-top: -7px;
  margin-bottom: -17px;
}
.indexArrows{
  /* display: block; */
  /* width: 26px; */
}
.counts{
  margin-bottom: -10px;
  margin-right: 5px;
  font-size: 14px;
  margin-left: 5px;
}
/************ Responseive***********/
@media (max-width: 600px) {
  .basmaleh {
    /* position: static; */
    /* text-align: center; */
    font-size: 12px;
    margin-top: 0px !important;
  }
  .infoBar {
    height: 92px !important;
  }
  .versesIndexes{
    display: none !important;
  }
.selectsWrap {
    width: 40px;
    margin-right: 0px;
    padding-top: 55px !important;
  }
  .pillsWrap{
    display: none !important;
  }
  .indexesArrwosWrap{
    display: flex !important;
  }
  .indexArrows {
    display: flex;
    width: 49px;
  }
  .titleWrap {
    /* text-align: center; */
  }
}
</style>
