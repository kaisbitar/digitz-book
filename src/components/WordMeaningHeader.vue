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
import { filterWords } from "@/utils/wordFilter"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import { fetchWordRoot } from "@/utils/dictionaryUtils"
import { removeTashkeel } from "@/utils/arabicUtils"
const router = useRouter()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const wordRoot = ref("")
const storedRoot = ref("")
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

const loadRoot = async (word) => {
  if (!word) return
  const root = await fetchWordRoot(word)
  if (!root) return
  storedRoot.value = root
  wordRoot.value = removeTashkeel(root)
}

const handleSearch = () => {
  const root = storedRoot.value || wordRoot.value
  if (!root) return

  const searched = filterWords(wordRoot.value, dataStore.getOneQuranFile, root, {
    removeTashkeel: true,
  })
  const results = searched.results || []
  if (!results.length) return

  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  tarteelStore.setLiveTarteel({
    inputText: wordRoot.value,
    results,
    wordRoot: wordRoot.value,
  })
  tarteelStore.commitDraft()
  router.push({ name: "tarteel", query: { view: "list" } })
}

watch(() => props.word, loadRoot)

defineEmits(["close"])
onMounted(() => loadRoot(props.word))
</script>

<style scoped></style>
