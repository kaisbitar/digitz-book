<template>
  <v-dialog v-model="isOpen" fullscreen>
    <v-layout>
      <v-app-bar density="compact">
        <v-app-bar-title>تدبري لـ ({{ word }})</v-app-bar-title>
        <template v-slot:append>
          <v-btn icon="mdi-close" @click="isOpen = false" />
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid class="fill-height pa-0">
          <v-row no-gutters style="height: 100%">
            <v-col cols="6" class="border-r bg-white">
              <v-card flat>
                <WordMeaning
                  :word="word"
                  class="px-4 chat-meaning-overflow"
                  :isWordMeaningOpen="true"
                  @meaningItemClick="handleMeaningItemClick"
                />
              </v-card>
            </v-col>

            <v-col cols="6" class="border-l bg-white">
              <v-card class="pa-4">
                <v-card-subtitle>الملاحظات السابقة</v-card-subtitle>
                <v-card-item
                  v-for="note in previousNotes"
                  :key="note.id"
                  :subtitle="note.note"
                  :prepend-icon="'mdi-note-text'"
                >
                  <template v-slot:title>
                    {{ formatDate(note.created_at) }}
                  </template>
                </v-card-item>
                <v-textarea
                  v-model="noteText"
                  label="أضف ملاحظتك"
                  rows="4"
                  auto-grow
                  :loading="loading"
                ></v-textarea>
                <v-col cols="4">
                  <v-btn
                    color="primary"
                    block
                    @click="saveNote"
                    :loading="loading"
                    class="mb-2"
                  >
                    {{ noteText ? "تحديث" : "حفظ" }}
                  </v-btn>
                </v-col>
              </v-card>
            </v-col>

            <!-- <v-col cols="3">
              <UserChat :word="word" />
            </v-col> -->
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useNotesStore } from "@/stores/notesStore"
import UserChat from "./UserChat.vue"

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

const previousNotes = computed(() =>
  notesStore.getNotesHistoryForWord(props.word)
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("EN")
}

const handleMeaningItemClick = (item) => {
  const meaningText = `${item.word}: ${item.meaning} (${item.dictionary})`
  noteText.value += noteText.value ? `\n\n${meaningText}` : meaningText
}
</script>

<style scoped>
.chat-meaning-overflow {
  height: calc(100vh - 100px);
  overflow: auto;
}
</style>
