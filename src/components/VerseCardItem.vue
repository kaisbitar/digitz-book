<template>
  <v-card
    class="px-4 pt-4 pb-4 mt-2 mb-2 verse-card-item"
    @click="handleClick"
    variant="outlined"
  >
    <v-card-subtitle class="verse-card-item-title mb-2">
      <v-chip size="small" class="mr-n3 ml-2">{{ index + 1 }} </v-chip>
      {{ item.suraNumber }} {{ item.suraName }}
    </v-card-subtitle>

    <v-card-text
      class="verse-card-item-text pa-1 mb-3"
      v-html="highlight(item.verseText, textToHighlight)"
    >
    </v-card-text>

    <AppMetaData :metaData="indexData" class="d-flex mr-3" />
    <AppMetaData :metaData="countData" class="d-flex mr-3" />
  </v-card>
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"
const { highlight } = useInputFiltering()
import { useTheme } from "vuetify"
const theme = useTheme()

const props = defineProps({
  item: Object,
  textToHighlight: String,
  index: Number,
  active: Boolean,
})
const emit = defineEmits(["verseClicked"])

const handleClick = () => {
  emit("verseClicked")
}

const indexData = computed(() => ({
  رقم: { value: props.item.verseIndex, color: "verse-count" },
  مصحف: {
    value: props.item.verseNumberToQuran,
    color: "verse-number-to-quran",
  },
}))
const countData = computed(() => ({
  كلمة: { value: props.item.numberOfWords, color: "word-count" },
  حرف: { value: props.item.numberOfLetters, color: "letter-count" },
}))
</script>

<style scoped></style>
