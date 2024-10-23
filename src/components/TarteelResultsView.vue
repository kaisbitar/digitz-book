<template>
  <!-- <div v-if="selectedData">
    <h2>{{ selectedData.inputText }}</h2>
    <div v-for="word in selectedData.selectedWords" :key="word.word">
      <h3>{{ word.word }} ({{ word.count }})</h3>
      <ul>
        <li v-for="verse in word.verses" :key="verse.verseId">
          {{ verse.verse }}
        </li>
      </ul>
    </div>
  </div> -->
  <v-expansion-panels v-if="selectedTarteel">
    <v-expansion-panel
      v-for="(tarteelItem, index) in selectedTarteel.results"
      :key="index"
    >
      <v-divider></v-divider>
      <v-expansion-panel-title>
        {{ tarteelItem.word }}
        <template v-slot:actions>
          <v-badge :content="tarteelItem.count" color="word-count"></v-badge>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list
          v-for="verse in tarteelItem.verses"
          :key="verse.verseNumberToQuran"
        >
          <VerseCardItem :item="verse" @click="handleSelectedVerse(verse)" />
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const props = defineProps({
  selectedTarteel: {
    type: Object,
    default: null,
  },
})

const activeRoute = computed(() => router.currentRoute.value.name)
const isMobile = computed(() => display.mobile.value)

const handleSelectedVerse = (verse) => {
  console.log(verse)
  store.setTarget({
    fileName: verse.fileName,
    verseIndex: verse.verseIndex,
    verseNumberToQuran: verse.verseNumberToQuran.toString(),
  })

  if (activeRoute !== "sura") {
    router.push({ name: "sura" })
  }

  store.setSearchIndex(-1)
}

onMounted(() => {})
</script>
