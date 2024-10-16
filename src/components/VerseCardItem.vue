<template>
  <v-card
    class="ma-auto mb-1 mr-1 ml-1"
    @click="handleClick"
    variant="elevated"
  >
    <div class="pt-4 pr-4 pl-4 mb-n1 d-flex justify-space-between align-center">
      <span class="text-primary text-caption"
        >{{ suraNumber }} {{ suraName }}
      </span>
      <v-chip variant="tonal" size="small">{{ index + 1 }} </v-chip>
    </div>
    <div
      class="pr-4 pl-4"
      v-html="highlight(item.verseText, textToHighlight)"
    ></div>
    <v-card-actions>
      <template v-for="(data, key) in chipData" :key="key" class="d-flex">
        <span class="text-grey text-caption mr-2"
          >{{ key }} {{ data.value }}</span
        >
        <!-- <v-chip
          variant="text"
          size="x-small"
          :color="data.color"
          :ripple="false"
        >
          {{ key }} {{ data.value }}
        </v-chip> -->
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
