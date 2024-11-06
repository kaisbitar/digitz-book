<template>
  <v-container>
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
            <div class="text-h6 mt-4">لا يوجد ملاحظات بعد</div>
            <div class="text-body-2 text-grey">
              ابدأ بإضافة ملاحظاتك على كلمات القرآن
            </div>
          </v-card-text>

          <template v-else>
            <v-list>
              <v-list-item v-for="note in notesStore.notes" :key="note.id">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-note-text</v-icon>
                </template>

                <v-list-item-title class="text-h6 mb-1">
                  {{ note.word }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ truncateText(note.note, 100) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    @click.stop="editNote(note)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click.stop="confirmDelete(note)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>
          تعديل التفسير
          <span class="text-subtitle-1 mr-2">({{ selectedNote?.word }})</span>
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="editedNoteText"
            rows="4"
            auto-grow
            :loading="saving"
          ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveEdit" :loading="saving">
            حفظ
          </v-btn>
          <v-btn color="error" @click="editDialog = false" :disabled="saving">
            إلغاء
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>تأكيد الحذف</v-card-title>
        <v-card-text> هل أنت متأكد من حذف هذه الملاحظة؟ </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteNote" :loading="deleting">
            حذف
          </v-btn>
          <v-btn @click="deleteDialog = false" :disabled="deleting">
            إلغاء
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useNotesStore } from "@/stores/notesStore"
import { useRouter } from "vue-router"

const router = useRouter()
const notesStore = useNotesStore()
const loading = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const selectedNote = ref(null)
const editedNoteText = ref("")

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
  editedNoteText.value = note.note
  editDialog.value = true
}

const saveEdit = async () => {
  if (!editedNoteText.value.trim() || !selectedNote.value) return

  saving.value = true
  try {
    await notesStore.updateNote(
      selectedNote.value.word,
      editedNoteText.value.trim()
    )
    editDialog.value = false
  } finally {
    saving.value = false
  }
}

const confirmDelete = (note) => {
  selectedNote.value = note
  deleteDialog.value = true
}

const deleteNote = async () => {
  if (!selectedNote.value) return

  deleting.value = true
  try {
    await notesStore.deleteNote(selectedNote.value.word)
    deleteDialog.value = false
  } finally {
    deleting.value = false
  }
}
</script>
