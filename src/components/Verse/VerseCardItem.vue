<template>
  <v-card
    hover
    class="px-4 pt-4 pb-4 mt-2 mb-2 verse-card-item"
    @click="handleClick"
    variant="outlined"
  >
    <div class="d-flex mb-2">
      <v-card-subtitle class="">
        <v-badge :content="index + 1" offset-x="-10" offset-y="-8"> </v-badge>
        <span class="mr-10"
          >{{ suraNumber }} {{ suraName }} - آية {{ item.verseIndex }}</span
        >
      </v-card-subtitle>
      <v-btn
        @click.stop.prevent="copyVerseText"
        size="small"
        class="mr-auto"
        :color="isCopied ? 'success' : undefined"
      >
        <v-icon class="ml-1" size="small">
          {{ isCopied ? "mdi-check" : "mdi-content-copy" }}</v-icon
        >
        {{ isCopied ? "تم النسخ" : "" }}
      </v-btn>
      <!-- <v-btn
        @click.stop.prevent="toggleTashkeel"
        size="small"
        class="mr-2"
        :color="showTashkeel ? undefined : 'primary'"
        >وو
      </v-btn> -->
    </div>
    <v-card-text
      class="verse-card-item-text pa-1 mb-3"
      v-html="highlight(displayText, textToHighlight)"
    />

    <div class="d-flex flex-row-reverse" :style="{ maxWidth: '1091px' }">
      <AppMetaData :metaData="countData" class="d-flex" />
      <AppMetaData :metaData="indexData" class="d-flex mr-3" />
    </div>
  </v-card>
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useCounting } from "@/mixins/counting"

const { highlight } = useInputFiltering()
const { calculateValue, countVerseLetters } = useCounting()

const props = defineProps({
  item: Object,
  textToHighlight: String,
  index: Number,
  active: Boolean,
})
const emit = defineEmits(["verseClicked"])

const showTashkeel = ref(true)
const displayText = computed(() => {
  if (showTashkeel.value) return props.item.verseText
  return props.item.verseText.replace(/[\u064B-\u0652\u0670]/g, "")
})

const toggleTashkeel = () => {
  showTashkeel.value = !showTashkeel.value
}

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

const isCopied = ref(false)

const copyVerseText = () => {
  const textToCopy =
    props.item.verseText +
    "\n" +
    "(" +
    props.item.fileName.replace(/[0-9]/g, "") +
    ": " +
    props.item.verseIndex +
    ")"
  navigator.clipboard.writeText(textToCopy)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 1000)
}

const indexData = computed(() => ({
  كلمة: {
    value: props.item.verseText.split(" ").length,
    color: "word-count",
  },
}))

const countData = computed(() => ({
  حرف: {
    value: countVerseLetters(props.item.verseText),
    color: "letter-count",
  },
  مصحف: {
    value: parseInt(props.item.verseNumberToQuran),
    color: "verse-number-to-quran",
  },
  مرقوم: {
    value: calculateValue(props.item.verseText),
    color: "word-count",
  },
}))
</script>
<style scoped></style>
