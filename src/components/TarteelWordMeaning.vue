<template>
  <div>
    <v-slide-y-transition>
      <v-skeleton-loader v-if="loading" type="article">
        فَإِنَّ مَعَ الْعُسْرِ يُسْرًا, إِنَّ مَعَ الْعُسْرِ يُسْرًا
      </v-skeleton-loader>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <div v-if="!loading">
        <v-list-item
          v-if="!expanded"
          :subtitle="results[0].meaning[0].dictionary"
          class="px-2"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-translate" class="mr-2" />
          </template>
          <v-list-item-title>
            <span class="ml-2">{{ results[0].meaning[0].word }}: </span>
            {{ results[0].meaning[0].meaning }}
          </v-list-item-title>
        </v-list-item>

        <v-list v-else lines="two">
          <v-list-item
            v-for="(item, index) in results[0]?.meaning"
            :key="index"
            :subtitle="item.dictionary"
          >
            <span class="ml-2">{{ item.word }}: </span>
            <span v-html="highlight(item.meaning, props.word)"></span>
          </v-list-item>
        </v-list>
      </div>
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
  expanded: {
    type: Boolean,
    required: true,
  },
})

const error = ref(null)
const loading = ref(true)
const results = computed(() => {
  if (!loading.value && !error.value) {
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
    error.value = null
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
  } catch (err) {
    console.error("Error fetching word meanings:", err)
    error.value = err
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
