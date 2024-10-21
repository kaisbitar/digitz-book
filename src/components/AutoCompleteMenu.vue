<template>
  <v-menu
    :modelValue="menu"
    @update:modelValue="$emit('update:menu', $event)"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
    transition="fade-transition"
    :max-height="'auto'"
    location="bottom"
  >
    <template v-slot:activator="{ props }">
      <div v-bind="props"></div>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <span class="ml-2">ترتيل {{ tarteel }}..</span>
          <v-divider vertical></v-divider>
          <v-badge
            :content="`${currentTarteelResults.length} مشتق`"
            floating
            offset-x="-10"
            offset-y="0"
            color="wordCount mr-2"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <AutoFilteredWords
          v-if="tarteel.length >= 2"
          ref="FilteredWordsList"
          :items="currentTarteelResults"
          :total-count="totalWordsCount"
          @update:items="updatecurrentTarteelResults"
          @tarteelAll="$emit('tarteelAll', $event)"
          @remove-item="removeFromTarteels"
        />
        <v-lazy
          v-else
          transition="fade-transition"
          :options="{
            threshold: 0.5,
          }"
        >
          <LettersChart v-if="tarteel.length < 2" :letter="currentLetter" />
        </v-lazy>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref } from "vue"
import AutoFilteredWords from "./AutoFilteredWords.vue"
import LettersChart from "./LettersChart.vue"

const props = defineProps({
  menu: Boolean,
  tarteel: String,
  currentTarteelResults: Array,
  totalWordsCount: Number,
  currentLetter: String,
})

const emit = defineEmits(["update:menu", "update:items", "tarteelAll"])

const FilteredWordsList = ref(null)

const updatecurrentTarteelResults = (newItems) => {
  console.log(newItems)
  emit("update:items", newItems)
}

const removeFromTarteels = (removedItem) => {
  const updatedTarteels = props.currentTarteelResults.filter(
    (item) => item !== removedItem
  )
  emit("update:items", updatedTarteels)
}
</script>
