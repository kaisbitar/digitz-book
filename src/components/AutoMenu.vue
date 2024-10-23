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
            :content="`${currentFilteredWords.length} مشتق`"
            floating
            offset-x="-10"
            offset-y="0"
            color="word-count mr-2"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-expand-transition>
          <AutoWordsList
            v-if="showAutoWordsList"
            :key="'filtered'"
            ref="FilteredWordsList"
            :items="currentFilteredWords"
            :total-count="totalWordsCount"
            :checkedItems="checkedItems"
            @update:items="updateCurrentList"
            @update:checkedItems="updateCheckedItems"
            @tarteelAll="$emit('tarteelAll', $event)"
            @remove-item="removeFromTarteels"
          />
          <v-lazy
            v-else
            :key="'chart'"
            :options="{
              threshold: 0.5,
            }"
          >
            <LettersChart :letter="currentLetter" />
          </v-lazy>
        </v-expand-transition>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  menu: Boolean,
  tarteel: String,
  currentFilteredWords: Array,
  totalWordsCount: Number,
  currentLetter: String,
  checkedItems: Array,
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "tarteelAll",
])

const FilteredWordsList = ref(null)
const showAutoWordsList = ref(false)
const debounceTimer = ref(null)

const updateCurrentList = (newItems) => {
  emit("update:items", newItems)
}

const updateCheckedItems = (newCheckedItems) => {
  emit("update:checkedItems", newCheckedItems)
}

const removeFromTarteels = (removedItem) => {
  console.log(removedItem)
  const updatedTarteels = props.currentFilteredWords.filter(
    (item) => item !== removedItem
  )
  emit("update:items", updatedTarteels)
}

const checkTarteelLength = () => {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    showAutoWordsList.value = props.tarteel.length >= 2
  }, 1500)
}

watch(
  () => props.tarteel,
  (newValue) => {
    if (newValue.length < 2) {
      showAutoWordsList.value = false
      if (debounceTimer.value) clearTimeout(debounceTimer.value)
    } else {
      checkTarteelLength()
    }
  }
)
</script>
