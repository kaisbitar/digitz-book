<template>
  <div class="d-flex align-center mb-4">
    <TableQuranIndex />
    <v-icon @click.stop="toggleDrawer">mdi-menu-open</v-icon>
    <span class="text-sm-h5 text-xs-h5 font-weight-bold ml-2">{{ title }}</span>
    <AppCountChips
      :wordCount="numberOfWords"
      :versesCount="numberOfVerses"
      :letterCount="numberOfLetters"
      :labels="{ word: 'كلمة', verse: 'آية', letter: 'حرف' }"
    />
  </div>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const props = defineProps({
  title: String,
  numberOfWords: Number,
  numberOfVerses: Number,
  numberOfLetters: Number,
})

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState)
}
</script>

<style scoped></style>
