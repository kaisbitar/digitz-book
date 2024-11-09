<template>
  <v-toolbar density="compact" elevation="1" class="mb-1">
    <v-toolbar-title>{{ word }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      density="compact"
      class="mr-2"
      @click="handleSearch"
      :loading="isSearching"
    >
      <v-icon>mdi-magnify</v-icon>
      <span class="ml-2">رتل {{ word }}</span>
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
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useQuranSearch } from "@/hooks/useQuranSearch"

const router = useRouter()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()
const { searchWord } = useQuranSearch(dataStore, tarteelStore)

const isSearching = ref(false)

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
  isSearching.value = true
  try {
    const hasResults = await searchWord(props.word)
    if (hasResults) {
      router.push({ name: "tarteel" })
    }
  } finally {
    isSearching.value = false
  }
}

defineEmits(["close"])
</script>

<style scoped></style>
