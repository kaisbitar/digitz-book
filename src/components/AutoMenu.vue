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
            :text="currentFilteredWords.length"
            :content="`${currentFilteredWords.length}`"
            floating
            offset-x="10"
            offset-y="-1"
            color="word-count mr-2"
          />
          <!-- <span class="mr-2 text-caption">مرة في القرآن</span> -->
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-expand-transition>
          <v-sheet
            v-if="showAutoWordsList"
            class="d-flex flex-column"
            height="100%"
          >
            <AutoWordList
              :items="currentFilteredWords"
              :checked-items="localCheckedItems"
              @update:checked-items="updateLocalCheckedItems"
              @add-item="emitAddItem"
              @remove-item="removeFromTarteels"
            />
            <v-sheet class="pa-4">
              {{ localCheckedItems.length }}
              <v-btn @click="onTarteelSubmit" color="primary" variant="tonal">
                رتل الجميع
              </v-btn>
            </v-sheet>
          </v-sheet>
          <v-lazy
            v-else
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
  "submitTarteel",
  "add-item",
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

// watch(
//   () => props.menu,
//   (newMenuState) => {
//     showAutoWordsList.value = newMenuState
//   }
// )

const updateLocalCheckedItems = (newItems) => {
  localCheckedItems.value = newItems
  emit("update:checkedItems", newItems)
}

const emitAddItem = (item) => {
  emit("add-item", item)
}

const removeFromTarteels = (item) => {
  emit("remove-item", item)
}

const onTarteelSubmit = () => {
  emit(
    "submitTarteel",
    localCheckedItems.value.length > 0
      ? localCheckedItems.value
      : props.currentFilteredWords
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
