<template>
  <div v-if="isWordMeaningOpen && phraseWords.length" class="d-flex align-center px-3 pt-3">
    <span class="text-subtitle-2 text-grey-darken-1">
      {{ displayedRoot || activeWord }}
    </span>
    <v-btn
      v-if="phraseWords.length > 1"
      size="x-small"
      variant="tonal"
      class="ms-auto"
      @click="nextWord"
    >
      التالي
    </v-btn>
  </div>
  <v-card-item v-if="loading">
    <v-fade-transition mode="out-in">
      <v-card-title class="pa-3">
        فَإِنَّ مَعَ الْعُسْرِ يُسْرًا, إِنَّ مَعَ الْعُسْرِ يُسْرًا
      </v-card-title>
    </v-fade-transition>
  </v-card-item>
  <v-slide-y-transition mode="out-in">
    <v-list
      v-if="isWordMeaningOpen && !loading"
      :key="results[0]?.meaning[0]?.word"
      border
      rounded
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'"
    >
      <v-list-item
        v-for="(item, index) in results[0]?.meaning"
        :key="index"
        :link="false"
        :ripple="false"
        class="py-4"
      >
        <div class="text-h5 mb-2">
          {{ item.word }}
        </div>
        <div class="meaning-body">{{ item.meaning }}</div>
        <div class="text-caption text-medium-emphasis mt-3">
          {{ item.dictionary }}
        </div>

        <v-divider v-if="index < results[0]?.meaning.length - 1" class="mt-4" />
      </v-list-item>
    </v-list>
  </v-slide-y-transition>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useStore } from "@/stores/appStore"
import { fetchWordData, fetchWordRoot } from "@/utils/dictionaryUtils.js"

const store = useStore()

defineEmits(["update:isWordMeaningOpen"])
const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "plain",
  },
  isWordMeaningOpen: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(true)
const wordIndex = ref(0)
const displayedRoot = ref("")

const phraseWords = computed(() =>
  (props.word || "").trim().split(/\s+/).filter(Boolean),
)
const activeWord = computed(
  () => phraseWords.value[wordIndex.value] || phraseWords.value[0] || "",
)

const results = computed(() => {
  if (!loading.value) {
    const meaning = store.getWordMeaning(activeWord.value)
    return meaning ? [{ meaning }] : [{ meaning: [] }]
  }
  return [{ meaning: [] }]
})

const fetchMeanings = async () => {
  if (!activeWord.value) return
  try {
    loading.value = true
    displayedRoot.value = (await fetchWordRoot(activeWord.value)) || ""
    return await fetchWordData(activeWord.value)
  } finally {
    loading.value = false
  }
}

const nextWord = () => {
  if (phraseWords.value.length < 2) return
  wordIndex.value = (wordIndex.value + 1) % phraseWords.value.length
}

onMounted(() => {
  if (!props.word) {
    return
  }
  fetchMeanings()
})

watch(
  () => props.word,
  async (newWord) => {
    wordIndex.value = 0
    if (newWord) await fetchMeanings()
  },
)
watch(activeWord, async (word) => {
  if (word) await fetchMeanings()
})
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.meaning-body {
  line-height: 1.9;
  white-space: normal;
}
</style>
