<template>
  <v-container class="sura-text-container">
    <span
      v-for="(verse, index) in suraTextArray"
      :key="index"
      :class="{ 'targeted-verse': isTargetedVerse(index) }"
      @click="setTargetedVerse(verse, index + 1)"
    >
      <span :id="`v${index + 1}`" class="verse-content">
        <span
          class="num-chip"
          :class="{ 'active-chip': isTargetedVerse(index) }"
        >
          {{ index + 1 }}
        </span>
        <span v-if="inputText" v-html="highlightVerseText(verse, inputText)" />
        <span v-else>{{ verse }}</span>
      </span>
    </span>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import { useMixin } from "../mixins/mixins"

const { createVerseId } = useMixin()

const props = defineProps(["inputText", "suraTextArray"])

const store = useQuranStore()

const suraTargetedVerseIndex = computed(() => store.getTarget?.verseIndex)
const isTargetedVerse = computed(
  () => (index) => index + 1 === parseInt(suraTargetedVerseIndex.value)
)

watch(
  () => props.suraTargetedVerseIndex,
  () => {
    const verse = createVerseId(props.suraTargetedVerseIndex)
    scrollToVerse(verse)
  }
)

const scrollToVerse = async () => {
  await nextTick()
  if (!document.getElementById("suraBlock")) return
  goTo(".targetedVerse", {
    container: "#suraBlock",
    offset: -100,
  })
}

const setTargetedVerse = (verse, index) => {
  store.setTarget({
    fileName: store.getTarget.fileName,
    verseIndex: index,
    verseNumberToQuran: verse.verseNumberToQuran,
  })
}

const highlightVerseText = (text, value) => {
  if (value === null) return text
  text = text.replace(/[\u064b-\u064f\u0650-\u0652]/g, "")
  const query = new RegExp(value, "ig")
  return text.replace(query, (match) => {
    return (
      '<span class="bg-orange-lighten-3 font-weight-bold">' + match + "</span>"
    )
  })
}

onMounted(() => {
  scrollToVerse(createVerseId(props.suraTargetedVerseIndex))
})
</script>

<style scoped>
.sura-text-container {
  display: block;
  line-height: 2.5;
  max-height: 79vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.verse-content {
  cursor: pointer;
  font-weight: 200;
}

.num-chip {
  /* background: rgb(var(--v-theme-on-highlight)); */
  margin: 0 6px;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.8em;
}

.targeted-verse {
  color: rgb(var(--v-theme-on-active-row));
  background: rgb(var(--v-theme-active-row));
  font-weight: 300;
}

.targeted-verse .num-chip {
  color: rgb(var(--v-theme-on-active-row));
}

.active-chip {
  background: rgb(var(--v-theme-on-active-row));
  color: rgb(var(--v-theme-active-row));
}

@media (max-width: 655px) {
  .sura-text-search-results {
    display: block;
  }
}
</style>
