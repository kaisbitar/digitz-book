<template>
  <v-card class="pa-3 verse-card-item" @click="handleClick" variant="plain">
    <v-card-subtitle class="verse-card-item-title">
      <v-chip variant="tonal" size="small">{{ index + 1 }} </v-chip>
      {{ suraNumber }} {{ suraName }}
    </v-card-subtitle>

    <v-card-text
      class="verse-card-item-text pa-1"
      v-html="highlight(item.verseText, textToHighlight)"
    >
    </v-card-text>

    <!-- <v-card-actions> -->
    <template v-for="(data, key) in chipData" :key="key" class="d-flex">
      <span class="text-caption mr-2 ml-1 count-key-item" :class="data.color"
        >{{ key }} </span
      ><span class="count-value-item">{{ data.value }}</span>
    </template>
    <!-- </v-card-actions> -->
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

const chipData = computed(() => ({
  رقم: { value: props.item.verseIndex, color: "verse-count" },
  كلمة: { value: props.item.numberOfWords, color: "word-count" },
  حرف: { value: props.item.numberOfLetters, color: "letter-count" },
  مصحف: {
    value: props.item.verseNumberToQuran,
    color: "verse-number-to-quran",
  },
}))
</script>

<style scoped>
.verse-card-item {
  border: 1px solid #424242;
  border-radius: 4px;
  margin-top: 5px;
}
</style>
