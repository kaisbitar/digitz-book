<template>
  <!-- <div class="meaning-panel"> -->
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
import { fetchWordData } from "@/utils/dictionaryUtils.js"

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

const results = computed(() => {
  if (!loading.value) {
    const meaning = store.getWordMeaning(props.word)
    return meaning ? [{ meaning }] : [{ meaning: [] }]
  }
  return [{ meaning: [] }]
})

const fetchMeanings = async () => {
  try {
    loading.value = true
    return await fetchWordData(props.word)
  } finally {
    loading.value = false
  }
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
    if (newWord) {
      await fetchMeanings()
    }
  },
)
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
