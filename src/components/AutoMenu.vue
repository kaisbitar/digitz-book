<template>
  <v-menu
    :modelValue="menu"
    :close-on-content-click="false"
    :max-height="'auto'"
    location="bottom"
    activator="parent"
    @update:modelValue="$emit('update:menu', $event)"
  >
    <v-list class="mt-1">
      <v-list-item>
        <v-list-item-title>
          <span class="ml-2">ترتيل {{ tarteel }}..</span>
          <span class="ml-2"> {{ currentWordsList.length }}</span>
          <v-badge
            :content="` رتل`"
            floating
            :color="currentWordsList.length > 0 ? 'word-count' : 'red'"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-sheet class="position-relative w-100">
        <v-scroll-x-transition mode="out-in">
          <AutoWordList
            :key="showAutoWordsList"
            v-if="showAutoWordsList"
            class="position-absolute w-100"
            :items="currentWordsList"
            :checked-items="localCheckedItems"
            @update:currentWordsList="updateWordsList"
            @update:checked-items="updateLocalCheckedItems"
          />
        </v-scroll-x-transition>

        <v-sheet class="position-relative">
          <v-lazy
            :options="{
              threshold: 0.5,
            }"
            :class="showAutoWordsList ? 'opacity-30' : ''"
          >
            <LettersChart :letter="currentLetter" />
          </v-lazy>
        </v-sheet>
      </v-sheet>
    </v-list>
    <v-sheet class="tarteel-btn">
      <AppTarteelBtn
        class="tarteel-btn"
        v-if="showAutoWordsList"
        :checked-items="localCheckedItems"
        :is-disabled="currentWordsList.length === 0"
        @submit="onTarteelSubmit"
      />
    </v-sheet>
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
  // debounceTimer.value = setTimeout(() => {
  showAutoWordsList.value = props.tarteel.length >= 2
  emit("update:menu", showAutoWordsList.value)
  // }, 500)
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

<style scoped>
.tarteel-btn {
  z-index: 2;
  /* opacity: 0.9; */
}
</style>
