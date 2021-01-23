<template>
  <v-row class="selectsWrap">
    <div class="pillsWrap">
      <div v-if="selectedVerse" class="elevation-0">
        <v-chip pill small class="yellow accent-1 selectedChip mb-1">
          آية: {{ selectedVerse }}
        </v-chip>
      </div>

      <div v-if="inputText" class="elevation-0">
        <v-chip pill small class="orange accent-1 selectedText">
          {{ inputText }}
        </v-chip>
      </div>
    </div>

    <div class="indexesArrwosWrap" v-if="inputText">
      <div class="counts">{{ SelectedVerseIndex }}/{{ foundIndexesCount }}</div>
      <div class="mt-1 indexArrows">
        <v-icon small @click="handleArrowClick('up')">mdi-chevron-up</v-icon>
        <v-icon small @click="handleArrowClick('down')"
          >mdi-chevron-down</v-icon
        >
      </div>
    </div>

    <suraTextInfoBarIndexes
      class="versesIndexes"
      :items="foundIndexesArr"
      :selectedVerse="SelectedVerseIndex"
    />
  </v-row>
</template>

<script>
import suraTextInfoBarIndexes from './suraTextInfoBarIndexes'

export default {
  name: '',
  components: { suraTextInfoBarIndexes },
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
    },
    SelectedSuraText () {
      if (!this.$store.state.suras[this.fileName]) return
      return this.$store.state.suras[this.fileName].suraText
    }
  },
  watch: {
    items () {
      this.findInputTextIndexes()
    }
  },
  methods: {
    findInputTextIndexes () {
      var array = []
      if (!this.SelectedSuraText) return
      this.SelectedSuraText.map((verse, index) => {
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
.counts {
  margin-bottom: -10px;
  margin-right: 5px;
  font-size: 14px;
  margin-left: 5px;
}
.selectsWrap {
  margin-right: 27px;
  margin-top: 9px;
  height: 68px;
  overflow-y: auto;
}
/************ Responseive***********/
@media (max-width: 600px) {
  .infoBar {
    height: 92px !important;
  }
  .versesIndexes {
    display: none !important;
  }
  .selectsWrap {
    width: 40px;
    margin-right: 0px;
    padding-top: 55px !important;
  }
  .pillsWrap {
    display: none !important;
  }
  .indexesArrwosWrap {
    display: flex !important;
  }
  .indexArrows {
    display: flex;
    width: 49px;
  }
}
</style>
