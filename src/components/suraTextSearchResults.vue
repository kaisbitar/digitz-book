<template>
  <v-row v-if="indices" class="selectsWrap d-flex pillsWrap">
    <v-card
      v-if="inputText"
      class="elevation-0 pl-2 pr-2 label grey lighten-3 ml-2"
      style="width: fit-content"
    >
      "<span class="font-weight-bold">{{ inputText }}</span
      >" = <span class="title">{{ indices.length }}</span>
      <span class="caption">مرة</span>
    </v-card>
    <div class="versesArrow d-none d-sm-block">
      <div><v-icon @click="arrowClick(-1)">mdi-chevron-up</v-icon></div>
      <div>
        <v-icon @click="arrowClick(1)" class="">mdi-chevron-down</v-icon>
      </div>
    </div>
    <label class="toVerse">
      <v-select
        class="toVerse"
        v-model="selectedIndex"
        :items="indices"
        label="إلى الآية"
      ></v-select>
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
    indices () {
      if (!this.inputText) return null
      var indices = []
      this.suraTextArray.filter((item, index) => {
        if (item.match(this.inputText)) {
          indices.push(index + 1)
        }
      })
      return indices
    },
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    setTargetedVerse (index) {
      this.$store.commit('setTarget', {
        fileName: this.fileName,
        verseIndex: index
      })
    },
    arrowClick (direction) {
      if (!this.indices[this.indices.indexOf(this.selectedIndex) + direction]) {
        if (direction === -1) {
          this.selectedIndex = (this.indices[this.indices.length - 1])
          return
        }
        this.selectedIndex = (this.indices[0])
        return
      }
      this.selectedIndex = (this.indices[this.indices.indexOf(this.selectedIndex) + direction])
    }
  },
  watch: {
    selectedIndex () {
      this.setTargetedVerse(this.selectedIndex)
    },
    selectedVerse () {
      this.selectedIndex = parseInt(this.selectedVerse)
    }
  },
  mounted () {
    this.selectedIndex = parseInt(this.selectedVerse)
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
.selectsWrap,
.selectsWrap .caption {
  font-family: "Tajawal", sans-serif !important;
}
.selectsWrap {
  margin-right: 180px;
  margin-top: 24px;
}
.toVerse {
  width: min-content;
  margin-top: -11px;
}
.versesArrow {
  margin-left: 19px;
  margin-right: 19px;
  margin-top: -15px;
  z-index: 72;
  position: relative;
}
.verseLabel {
  width: 70px;
}

@media (max-width: 655px) {
  .selectsWrap {
    margin-right: -190px;
    margin-top: 86px !important;
    margin-bottom: -14px;
  }
  .toVerse {
    margin-right: 10px;
  }
}
/************ Responsive***********/
@media (max-width: 600px) {
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
