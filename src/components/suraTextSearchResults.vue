<template>
  <v-row v-if="foundIndexes" class="selectsWrap d-flex pillsWrap mb-1">
    <v-card
      class="verseLabel elevation-0 pl-3 pr-3 ml-1 label yellow accent-1 text-center"
    >
      آية {{ selectedIndex }}
    </v-card>
    <v-card
      v-if="inputText"
      class="elevation-0 pl-2 pr-2 label orange accent-1 ml-2"
      style="width: fit-content"
    >
      <span class="">"{{ inputText }}"</span> - {{ foundIndexes.length }} آية
    </v-card>
    <div class="versesArrow">
      <div>
        <v-icon @click="arrowClick(-1)">mdi-chevron-up</v-icon>
      </div>
      <div>
        <v-icon @click="arrowClick(1)" class="">mdi-chevron-down</v-icon>
      </div>
    </div>
    <label class="toVerse">
      <v-select
        class="toVerse"
        v-if="foundIndexes.length > 10"
        v-model="selectedIndex"
        :items="foundIndexes"
        label="إلى الآية"
      ></v-select>
    </label>
    <label class="d-flex" v-if="foundIndexes.length <= 10">
      <v-card
        v-for="(foundIndex, index) in foundIndexes"
        :key="index"
        class="elevation-0 ml-1 numberLabel pl-1 pr-1"
        :class="{ active: foundIndex === selectedVerse }"
        outlined
        @click="setTargetedVerse(foundIndex)"
      >
        {{ foundIndex }}
      </v-card>
    </label>
  </v-row>
</template>

<script>
export default {
  name: '',
  props: ['inputText', 'items', 'suraTextArray'],
  data: () => ({
    selectedIndex: 0
  }),
  computed: {
    selectedVerse () {
      if (!this.$store.getters.target) return 1
      return this.$store.getters.target.verseIndex
    },
    foundIndexes () {
      if (!this.inputText) return null
      var foundIndexes = []
      this.suraTextArray.filter((item, index) => {
        if (item.match(this.inputText)) {
          foundIndexes.push(index + 1)
          return item
        }
      })
      return foundIndexes
    },
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    setTargetedVerse (selectedIndex) {
      this.$store.commit('setTarget', { fileName: this.fileName, verseIndex: selectedIndex })
    },
    arrowClick (direction) {
      var selectedIndex = 0
      this.foundIndexes.filter((item, index) => {
        if (item === this.selectedIndex) {
          selectedIndex = this.foundIndexes[index + direction]
        }
      })
      if (selectedIndex === 0) {
        selectedIndex = this.foundIndexes[0]
      }
      this.setTargetedVerse(selectedIndex)
    }
  },
  watch: {
    selectedIndex () {
      this.setTargetedVerse(this.selectedIndex)
    },
    selectedVerse () {
      this.selectedIndex = this.selectedVerse
    }
  },
  created () {
    this.selectedIndex = this.selectedVerse
  },
  mounted () {}
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
.label {
  height: fit-content;
}
.numberLabel {
  width: 43px;
  height: fit-content;
  text-align: center;
  opacity: 0.2;
}
.active {
  opacity: 1;
}
.selectsWrap {
  margin-right: 79px;
  margin-top: 16px;
}
.toVerse {
  width: min-content;
  margin-top: -11px;
}
.versesArrow {
  margin-left: 19px;
  margin-right: 19px;
  margin-top: -12px;
}
.verseLabel {
  width: 70px;
}

@media (max-width: 655px) {
  .selectsWrap {
    /* width: 40px; */
    margin-right: 0px;
    /* padding-top: 55px !important; */
  }
}
/************ Responseive***********/
@media (max-width: 600px) {
  .titleText {
    display: none;
  }
  .infoBar {
    height: 92px !important;
  }
  .versesIndexes {
    display: none !important;
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
