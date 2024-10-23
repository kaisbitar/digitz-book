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
            <v-list class="flex-grow-1 overflow-y-auto">
              <v-virtual-scroll
                :items="currentFilteredWords"
                height="300"
                item-height="50"
              >
                <template v-slot:default="{ item }">
                  <AutoWordItem
                    :item="item"
                    :checked="isItemChecked(item)"
                    @add-item="emitAddItem"
                    @remove-item="removeFromTarteels"
                    @update:checked="toggleItemCheck(item)"
                  />
                </template>
              </v-virtual-scroll>
            </v-list>
            <v-sheet class="pa-4">
              {{ checkedItems.length }}
              <v-btn @click="tarteelSubmit" color="primary" variant="tonal">
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
])

const showAutoWordsList = ref(false)
const debounceTimer = ref(null)

const isItemChecked = (item) =>
  props.checkedItems.some((checkedItem) => checkedItem.word === item.word)

const emitAddItem = (item) => {
  const newCheckedItems = [...props.checkedItems, item]
  emit("update:checkedItems", newCheckedItems)
}

const removeFromTarteels = (removedItem) => {
  const updatedTarteels = props.currentFilteredWords.filter(
    (item) => item !== removedItem
  )
  emit("update:items", updatedTarteels)
  const updatedCheckedItems = props.checkedItems.filter(
    (item) => item !== removedItem
  )
  emit("update:checkedItems", updatedCheckedItems)
}

const tarteelSubmit = () => {
  emit("submitTarteel")
}

const toggleItemCheck = (item) => {
  const newCheckedItems = props.checkedItems.includes(item)
    ? props.checkedItems.filter((checkedItem) => checkedItem !== item)
    : [...props.checkedItems, item]
  emit("update:checkedItems", newCheckedItems)
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
