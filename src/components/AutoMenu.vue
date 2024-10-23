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
          <!-- <span class="ml-6">كلمات</span> -->
          <v-badge
            :content="`${currentWordsList.length} مشتق`"
            floating
            color="word-count"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-expand-transition>
          <v-list v-if="showAutoWordsList" class="d-flex flex-column">
            <v-list-item>
              <AutoWordList
                :items="currentWordsList"
                :checked-items="localCheckedItems"
                @update:currentWordsList="updateWordsList"
                @update:checked-items="updateLocalCheckedItems"
              />
            </v-list-item>
            <v-list-item>
              <v-btn
                @click="onTarteelSubmit"
                color="primary"
                variant="tonal"
                block
                size="large"
              >
                <span v-show="localCheckedItems.length === 0">
                  رتل جميع الكلمات</span
                >

                <span
                  v-show="localCheckedItems.length > 0"
                  class="font-weight-bold"
                >
                  <v-scale-transition>
                    <v-badge
                      :key="localCheckedItems.length"
                      :content="localCheckedItems.length.toString()"
                      offset-y="-9"
                      offset-x="20"
                      color="word-count"
                    >
                      <template v-slot:badge>
                        <div class="custom-badge">
                          {{ localCheckedItems.length }}
                        </div>
                      </template>
                    </v-badge>
                  </v-scale-transition>
                  رتل
                  <!-- كلمات -->
                </span>
              </v-btn>
            </v-list-item>
          </v-list>
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
