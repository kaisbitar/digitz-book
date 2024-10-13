<template>
  <v-card
    class="mr-1 ml-1 mt-1 mb-1"
    :class="{ 'active-verse': active }"
    @click="handleClick"
  >
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-blue">{{ suraNumber }} {{ suraName }} </span>
      <v-chip variant="tonal" size="small">{{ index + 1 }} </v-chip>
    </v-card-title>
    <v-card-text v-html="highlight(item.verseText, textToHighlight)" />
    <v-card-actions class="d-flex justify-start">
      <v-chip
        v-for="(data, key) in chipData"
        :key="key"
        variant="tonal"
        size="small"
        :color="data.color"
        backgound="blue"
        :ripple="false"
      >
        {{ key }}: {{ data.value }}
      </v-chip>
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
const avatarColor = computed(() => {
  return theme.global.current.value.dark ? "grey-darken-3" : "grey-lighten-3"
})

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
