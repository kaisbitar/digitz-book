import { defineStore } from "pinia"
import { supabase } from "@/config/supabase"
import { useAuthStore } from "@/stores/authStore"

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: "NotesStore",
        storage: localStorage,
      },
    ],
  },

  getters: {
    getNoteByWord: (state) => (word) => {
      return state.notes.find((note) => note.word === word)
    },
    hasNotes: (state) => state.notes.length > 0,
  },

  actions: {
    async addNote(word, note) {
      const authStore = useAuthStore()
      if (!authStore.user) throw new Error("User must be logged in")

      try {
        const { data, error } = await supabase
          .from("user_notes")
          .insert([
            {
              word,
              note,
              user_id: authStore.user.id,
            },
          ])
          .select()
          .single()

        if (error) throw error
        this.notes.push(data)
        return data
      } catch (error) {
        console.error("Error adding note:", error)
        throw error
      }
    },

    async loadUserNotes() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      try {
        const { data, error } = await supabase
          .from("user_notes")
          .select()
          .eq("user_id", authStore.user.id)

        if (error) throw error
        this.notes = data
      } catch (error) {
        console.error("Error loading notes:", error)
        throw error
      }
    },

    async getNoteForWord(word) {
      const localNote = this.getNoteByWord(word)
      if (localNote) return localNote

      const authStore = useAuthStore()
      if (!authStore.user) return null
      try {
        console.log("Fetching note for:", {
          word,
          userId: authStore.user.id,
        })

        const { data, error } = await supabase
          .from("user_notes")
          .select("*")
          .eq("user_id", authStore.user.id)
          .eq("word", word)
          .maybeSingle()

        if (error) throw error
        if (data) this.notes.push(data)
        return data
      } catch (error) {
        console.error("Error fetching note:", error)
        return null
      }
    },

    async updateNote(word, note) {
      const authStore = useAuthStore()
      if (!authStore.user) throw new Error("User must be logged in")

      try {
        const { data, error } = await supabase
          .from("user_notes")
          .update({ note })
          .eq("word", word)
          .eq("user_id", authStore.user.id)
          .select()
          .single()

        if (error) throw error

        // Update local store
        const index = this.notes.findIndex((n) => n.word === word)
        if (index !== -1) {
          this.notes[index] = data
        }

        return data
      } catch (error) {
        console.error("Error updating note:", error)
        throw error
      }
    },

    async deleteNote(word) {
      const authStore = useAuthStore()
      if (!authStore.user) throw new Error("User must be logged in")

      try {
        const { error } = await supabase
          .from("user_notes")
          .delete()
          .eq("word", word)
          .eq("user_id", authStore.user.id)

        if (error) throw error

        // Update local store
        this.notes = this.notes.filter((note) => note.word !== word)
      } catch (error) {
        console.error("Error deleting note:", error)
        throw error
      }
    },
  },
})
