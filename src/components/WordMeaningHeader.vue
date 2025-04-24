<template>
  <v-toolbar density="compact" elevation="1" class="mb-1">
    <v-toolbar-title>{{ word }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn density="compact" class="mr-2" @click="handleSearch">
      <v-icon>mdi-magnify</v-icon>
      <span class="ml-2">رتل {{ wordRoot }}</span>
    </v-btn>
    <v-btn
      v-if="isWordMeaningOpen"
      icon="mdi-close"
      density="compact"
      @click="$emit('close')"
    />
  </v-toolbar>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useSearchTarteel } from "@/hooks/useSearchTarteel"
import { filterWords } from "@/utils/wordFilter"
import { useDataStore } from "@/stores/dataStore"
import { fetchWordRootData } from "@/utils/dictionaryUtils"
import { removeTashkeel } from "@/utils/arabicUtils"
const router = useRouter()
const dataStore = useDataStore()
const { setTarteel } = useSearchTarteel()

const wordRoot = ref("")
const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  isWordMeaningOpen: {
    type: Boolean,
    required: true,
  },
})

const handleSearch = async () => {
  const tarteel = await filterWords(wordRoot.value, dataStore.getOneQuranFile)
  await setTarteel(tarteel.results, wordRoot.value)
  router.push({ name: "tarteel" })
}

watch(
  () => props.word,
  async (newWord) => {
    if (newWord) {
      const root = await fetchWordRootData(newWord)
      wordRoot.value = removeTashkeel(root)
    }
  }
)

defineEmits(["close"])
onMounted(async () => {
  const root = await fetchWordRootData(props.word)
  wordRoot.value = removeTashkeel(root)
})
</script>

<style scoped></style>
