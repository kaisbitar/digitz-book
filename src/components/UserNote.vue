<template>
  <v-card>
    <v-card-title>
      تفسيري <span class="mr-2">({{ word }})</span>
    </v-card-title>

    <v-card-text>
      <v-textarea
        v-model="noteText"
        label="وَلَا يَأْتُونَكَ بِمَثَلٍ إِلَّا جِئْنَٰكَ بِالْحَقِّ وَأَحْسَنَ تَفْسِيرًا"
        rows="4"
        auto-grow
        :loading="loading"
      ></v-textarea>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveNote" :loading="loading">
        {{ existingNote ? "تحديث" : "حفظ" }}
      </v-btn>
      <v-btn color="error" @click="dialog = false" :disabled="loading">
        إلغاء
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useNotesStore } from "@/stores/notesStore"

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
})

const notesStore = useNotesStore()
const noteText = ref("")
const loading = ref(false)
const existingNote = ref(null)

// Load existing note when component mounts
onMounted(async () => {
  loading.value = true
  try {
    const note = await notesStore.getNoteForWord(props.word)
    if (note) {
      existingNote.value = note
      noteText.value = note.note
    }
  } catch (error) {
    console.error("Failed to load note:", error)
  } finally {
    loading.value = false
  }
})

const saveNote = async () => {
  if (!noteText.value.trim()) return

  loading.value = true
  try {
    if (existingNote.value) {
      // Update existing note
      await notesStore.updateNote(props.word, noteText.value.trim())
    } else {
      // Create new note
      await notesStore.addNote(props.word, noteText.value.trim())
    }
  } catch (error) {
    console.error("Failed to save note:", error)
  } finally {
    loading.value = false
  }
}
</script>
