<template>
  <div>
    <v-fade-transition v-if="loading" mode="out-in">
      فَإِنَّ مَعَ الْعُسْرِ يُسْرًا, إِنَّ مَعَ الْعُسْرِ يُسْرًا
    </v-fade-transition>

    <v-slide-y-transition mode="out-in">
      <div v-if="!loading">
        <v-list-item v-if="!expanded" lines="one" class="px-2">
          <template v-slot:prepend>
            <v-icon icon="mdi-translate" class="mr-2" />
          </template>

          <v-list-item-title key="content">
            {{ results[0].meaning[0].word }}
          </v-list-item-title>
          <v-list-item-subtitle>{{
            results[0].meaning[0].meaning
          }}</v-list-item-subtitle>
          <span class="text-caption">{{
            results[0].meaning[0].dictionary
          }}</span>
        </v-list-item>

        <WordMeaningCard :meanings="results[0]?.meaning" />
        <!-- <v-card v-else lines="two">
          <v-card-item
            v-for="(item, index) in results[0]?.meaning"
            :key="index"
          >
            <v-card-title class="ml-2 count-key-item">{{
              item.word
            }}</v-card-title>
            <v-card-text class="mb-n5">{{ item.meaning }} </v-card-text>
            <span class="text-caption count-key-item">{{
              item.dictionary
            }}</span>
            <v-divider horizontal length="50%" class="mt-7" />
          </v-card-item>
        </v-card> -->
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

const loading = ref(true)
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
