<template>
  <v-card
    hover
    class="px-4 pt-4 pb-4 mt-2 mb-2 verse-card-item"
    @click="handleClick"
    variant="outlined"
  >
    <v-card-subtitle class="verse-card-item-title mb-2">
      <v-badge :content="index + 1" offset-x="-10" offset-y="-8"> </v-badge>
      <span class="mr-10">{{ suraNumber }} {{ suraName }}</span>
    </v-card-subtitle>

    <v-card-text
      class="verse-card-item-text pa-1 mb-3"
      v-html="highlight(item.verseText, textToHighlight)"
    />
    <!-- <VerseWords v-else :verse="item.verseText" /> -->
    <div class="d-flex flex-row-reverse" :style="{ maxWidth: '1091px' }">
      <AppMetaData :metaData="countData" class="d-flex mr-3" />
      <AppMetaData :metaData="indexData" class="d-flex mr-3" />
    </div>
  </v-card>
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"
const { highlight } = useInputFiltering()

const props = defineProps({
  item: Object,
  textToHighlight: String,
  index: Number,
  active: Boolean,
})
const emit = defineEmits(["verseClicked"])

const suraNumber = computed(() => {
  const numberPart = props.item.fileName
    .replace(/[ء-٩]/g, "")
    .replace(/\s/g, "")
  return parseInt(numberPart, 10).toString()
})

const suraName = computed(() => props.item.fileName.replace(/[0-9]/g, ""))

const handleClick = () => {
  emit("verseClicked")
}

const indexData = computed(() => ({
  رقم: { value: props.item.verseIndex, color: "verse-count" },
  كلمة: {
    value: props.item.verseText.split(" ").length.toString(),
    color: "word-count",
  },
}))

const countData = computed(() => ({
  حرف: {
    value: props.item.verseText.replace(/ /g, "").length.toString(),
    color: "letter-count",
  },
  مصحف: {
    value: props.item.verseNumberToQuran,
    color: "verse-number-to-quran",
  },
}))
</script>
<style scoped></style>
