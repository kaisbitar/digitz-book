<template>
  <div>
    <v-fade-transition v-if="loading" mode="out-in">
      فَإِنَّ مَعَ الْعُسْرِ يُسْرًا, إِنَّ مَعَ الْعُسْرِ يُسْرًا
    </v-fade-transition>

    <v-slide-y-transition mode="out-in">
      <WordMeaningCard
        v-if="!loading"
        :meanings="results[0]?.meaning"
        :expanded="expanded"
        :cardClass="expanded ? 'tarteel-meaning-overflow' : 'fixed-height'"
        @click="expanded = !expanded"
      />
    </v-slide-y-transition>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"
import {
  fetchWordRootData,
  fetchWordMeaningData,
} from "@/utils/dictionaryUtils.js"

const store = useStore()
const { highlight } = useInputFiltering()

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
})

const loading = ref(true)
const expanded = ref(false)

const results = computed(() => {
  if (!loading.value) {
    const meaning = store.getWordMeaning(props.word)
    return meaning ? [{ meaning }] : [{ meaning: [] }]
  }
  return [{ meaning: [] }]
})

const storedMeaning = computed(() => ({
  get: (word) => store.getWordMeaning(word),
  has: (word) => !!store.getWordMeaning(word),
}))

const fetchMeanings = async () => {
  try {
    loading.value = true
    if (storedMeaning.value.has(props.word)) {
      return
    }
    const wordRoot = await fetchWordRootData(props.word)
    await nextTick()
    const extractedMeaning = await fetchWordMeaningData(props.word, wordRoot)

    if (extractedMeaning && extractedMeaning[0]?.meaning?.length > 0) {
      store.setWordMeaning(props.word, extractedMeaning[0].meaning)
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchMeanings()
})

watch(
  () => props.word,
  async (newWord) => {
    if (newWord) {
      await fetchMeanings()
    }
  }
)
</script>

<style scoped></style>
