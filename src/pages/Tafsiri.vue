<template>
  <v-container class="tafsiri-board-overflow">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4">
            تفسيري
            <v-chip class="mr-2" color="primary" size="small">
              {{ notesStore.notes.length }}
            </v-chip>
          </v-card-title>

          <v-card-text v-if="loading">
            <v-progress-linear indeterminate></v-progress-linear>
          </v-card-text>

          <v-card-text
            v-else-if="!notesStore.hasNotes"
            class="text-center pa-8"
          >
            <v-icon size="64" color="grey">mdi-note-outline</v-icon>
            <div class="text-h6 mt-4">
              كتب أنزلنه إليك مبرك ليدبروا آيته وليتذكر أولوا الألبب
            </div>
            <div class="text-body text-grey">
              ابدأ بإضافة ملاحظاتك على كلمات القرآن
            </div>
          </v-card-text>

          <template v-else>
            <v-list>
              <v-list-item
                v-for="note in notesStore.notes"
                :key="note.id"
                @click="editNote(note)"
                :ripple="true"
                class="cursor-pointer"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-note-text-outline</v-icon>
                </template>

                <v-list-item-title class="text-h6 mb-1">
                  {{ note.word }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ truncateText(note.note, 100) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    size="small"
                    @click.stop="confirmDelete(note)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <UserNote
      v-if="selectedNote"
      v-model="editDialog"
      :word="selectedNote.word"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useNotesStore } from "@/stores/notesStore"
import UserNote from "@/components/UserNote.vue"

const notesStore = useNotesStore()
const loading = ref(false)
const editDialog = ref(false)
const selectedNote = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    await notesStore.loadUserNotes()
  } finally {
    loading.value = false
  }
})

const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

const editNote = (note) => {
  selectedNote.value = note
  editDialog.value = true
}

const confirmDelete = async (note) => {
  if (confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
    try {
      await notesStore.deleteNote(note.word)
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }
}

watch(editDialog, (isOpen) => {
  if (!isOpen) {
    selectedNote.value = null
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.tafsiri-board-overflow {
  height: calc(100vh - 230px);
  overflow: auto;
}
</style>
