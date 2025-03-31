<template>
  <div>
    <v-card-item v-if="loading">
      <v-fade-transition mode="out-in">
        <v-card-title class="pa-3">
          فَإِنَّ مَعَ الْعُسْرِ يُسْرًا, إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </v-card-title>
      </v-fade-transition>
    </v-card-item>

    <v-card hover v-if="!isWordMeaningOpen && !loading">
      <v-card-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-translate" class="mx-2" />
        </template>

        <v-card-title class="ml-2 count-key-item">
          {{ results[0]?.meaning[0]?.word }}
        </v-card-title>
        <v-card-text class="text-truncate mb-n5">
          {{ results[0]?.meaning[0]?.meaning }}
        </v-card-text>
        <span class="text-caption count-key-item">
          {{ results[0]?.meaning[0]?.dictionary }}
        </span>
      </v-card-item>
    </v-card>

    <v-slide-y-transition mode="out-in">
      <v-list
        v-if="isWordMeaningOpen"
        :key="results[0]?.meaning[0]?.word"
        :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'"
      >
        <v-list-item
          v-for="(item, index) in results[0]?.meaning"
          @click="emit('meaningItemClick', item)"
          :key="index"
        >
          <v-list-item-title class="ml-2 count-key-item">
            {{ item.word }}
          </v-list-item-title>

          {{ item.meaning }}
          <v-list-item-subtitle class="text-caption count-key-item">{{
            item.dictionary
          }}</v-list-item-subtitle>

          <v-divider
            v-if="index < results[0]?.meaning.length - 1"
            horizontal
            length="50%"
            class="mt-7"
          />
        </v-list-item>
      </v-list>
    </v-slide-y-transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useStore } from "@/stores/appStore"
import { fetchWordData } from "@/utils/dictionaryUtils.js"

const store = useStore()

const emit = defineEmits(["update:isWordMeaningOpen", "meaningItemClick"])
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
  }
)
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
