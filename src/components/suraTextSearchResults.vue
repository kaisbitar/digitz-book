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
      <v-select class="toVerse" :items="indices" label="إلى الآية"></v-select>
    </label>
  </v-row>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'

const props = defineProps(['inputText', 'items', 'suraTextArray'])
const store = useQuranStore()

const selectedIndex = ref(0)

const selectedVerse = computed(() => {
  if (!store.getTarget) return 1
  return store.getTarget.verseIndex
})

const indices = computed(() => {
  if (!props.inputText) return null
  return props.suraTextArray.reduce((acc, item, index) => {
    if (item.match(props.inputText)) {
      acc.push(index + 1)
    }
    return acc
  }, [])
})

const fileName = computed(() => {
  if (!store.getTarget) return
  return store.getTarget.fileName
})

const setTargetedVerse = index => {
  store.setTarget({
    fileName: fileName.value,
    verseIndex: index,
  })
}

const arrowClick = direction => {
  const currentIndex = indices.value.indexOf(selectedIndex.value)
  const newIndex = currentIndex + direction
  if (newIndex < 0) {
    selectedIndex.value = indices.value[indices.value.length - 1]
  } else if (newIndex >= indices.value.length) {
    selectedIndex.value = indices.value[0]
  } else {
    selectedIndex.value = indices.value[newIndex]
  }
}

watch(selectedIndex, () => {
  setTargetedVerse(parseInt(selectedIndex.value))
})

watch(selectedVerse, () => {
  selectedIndex.value = parseInt(selectedVerse.value)
})

onMounted(() => {
  if (!selectedVerse.value) return
  selectedIndex.value = selectedVerse.value
})
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
  font-family: 'Tajawal', sans-serif !important;
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
