<template>
  <v-bottom-sheet v-model="isOpen" scrollable>
    <v-card class="mx-auto" max-width="600px">
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <v-card-title>
              تفسيري <span class="mr-2">({{ word }})</span>
            </v-card-title>

            <v-btn
              v-if="isWordMeaningOpen"
              icon="mdi-close"
              elevation="0"
              class="mr-auto d-block"
              @click="isWordMeaningOpen = false"
            />

            <WordMeaning
              :word="word"
              class="px-4"
              :isWordMeaningOpen="isWordMeaningOpen"
              :class="
                isWordMeaningOpen ? 'tarteel-meaning-overflow' : 'fixed-height'
              "
              @update:isWordMeaningOpen="isWordMeaningOpen = $event"
              @click="isWordMeaningOpen = true"
            />

            <v-card-text>
              <v-textarea
                v-model="noteText"
                label="أضف ملاحظتك"
                rows="4"
                auto-grow
                :loading="loading"
              ></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveNote" :loading="loading">
                {{ noteText ? "تحديث" : "حفظ" }}
              </v-btn>
              <v-btn color="error" @click="isOpen = false" :disabled="loading">
                إلغاء
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useNotesStore } from "@/stores/notesStore"

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  verses: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(["update:modelValue"])

const isWordMeaningOpen = ref(false)
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
})

const notesStore = useNotesStore()
const loading = ref(false)

const currentNote = computed(() => notesStore.getNoteByWord(props.word))

const noteText = ref("")

watch(
  currentNote,
  (newNote) => {
    if (newNote) {
      noteText.value = newNote.note
    } else {
      noteText.value = ""
    }
  },
  { immediate: true }
)

const saveNote = async () => {
  if (!noteText.value.trim()) return

  loading.value = true
  try {
    if (currentNote.value) {
      await notesStore.updateNote(props.word, noteText.value.trim())
    } else {
      await notesStore.addNote(props.word, noteText.value.trim())
    }
    isOpen.value = false
  } catch (error) {
    console.error("Failed to save note:", error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await notesStore.getNoteForWord(props.word)
  } catch (error) {
    console.error("Failed to load note:", error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fixed-height {
  height: 100px; /* or whatever height you prefer */
  overflow: hidden;
}

.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
