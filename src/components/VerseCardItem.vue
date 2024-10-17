<template>
  <v-card class="mb-1" @click="handleClick" variant="elevated">
    <v-card-subtitle
      class="pt-4 pr-4 pl-4 mb-n1 d-flex justify-space-between align-center"
    >
      {{ suraNumber }} {{ suraName }}
      <v-chip variant="tonal" size="small">{{ index + 1 }} </v-chip>
    </v-card-subtitle>

    <v-card-text
      class="pr-4 pl-4"
      v-html="highlight(item.verseText, textToHighlight)"
    >
    </v-card-text>

    <v-card-actions>
      <template v-for="(data, key) in chipData" :key="key" class="d-flex">
        <span class="text-grey text-caption mr-2"
          >{{ key }} {{ data.value }}</span
        >
      </template>
    </v-card-actions>
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
  رقم: { value: props.item.verseIndex, color: "verseCount" },
  كلمة: { value: props.item.numberOfWords, color: "wordCount" },
  حرف: { value: props.item.numberOfLetters, color: "letterCount" },
  مصحف: { value: props.item.verseNumberToQuran, color: "QuranCount" },
}))
</script>

<style scoped></style>
