<template>
  <v-menu
    :modelValue="menu"
    @update:modelValue="$emit('update:menu', $event)"
    :close-on-content-click="false"
    offset="2"
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
          <v-badge
            :content="`${currentWordsList.length} رتل`"
            floating
            :color="currentWordsList.length > 0 ? 'word-count' : 'red'"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <!-- <v-list-item> -->
      <v-expand-transition>
        <div v-if="showAutoWordsList">
          <AutoWordList
            :items="currentWordsList"
            :checked-items="localCheckedItems"
            @update:currentWordsList="updateWordsList"
            @update:checked-items="updateLocalCheckedItems"
          />
          <AppTarteelBtn
            :checked-items="localCheckedItems"
            :is-disabled="currentWordsList.length === 0"
            @submit="onTarteelSubmit"
          />
        </div>
        <v-lazy
          v-else
          :options="{
            threshold: 0.5,
          }"
        >
          <LettersChart :letter="currentLetter" />
        </v-lazy>
      </v-expand-transition>
      <!-- </v-list-item> -->
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  menu: Boolean,
  tarteel: String,
  currentWordsList: Array,
  totalWordsCount: Number,
  currentLetter: String,
  checkedItems: Array,
})

const emit = defineEmits([
  "update:menu",
  "update:items",
  "update:checkedItems",
  "submitTarteel",
  "remove-item",
])

const showAutoWordsList = ref(false)
const localCheckedItems = ref(props.checkedItems || [])
const debounceTimer = ref(null)

watch(
  () => props.checkedItems,
  (newCheckedItems) => {
    localCheckedItems.value = newCheckedItems
  }
)

const updateWordsList = (newItems) => {
  emit("update:items", newItems)
}

const updateLocalCheckedItems = (newItems) => {
  localCheckedItems.value = newItems
  emit("update:checkedItems", newItems)
}

const onTarteelSubmit = () => {
  emit(
    "submitTarteel",
    localCheckedItems.value.length > 0
      ? localCheckedItems.value
      : props.currentWordsList
  )
}

const checkTarteelLength = () => {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    showAutoWordsList.value = props.tarteel.length >= 2
    emit("update:menu", showAutoWordsList.value)
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

onMounted(() => {})
</script>
