import { defineStore } from "pinia"
import { supabase } from "@/config/supabase"
import { useNotesStore } from "@/stores/notesStore"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userSettings: null,
    loading: false,
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth-store",
        storage: localStorage,
      },
    ],
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    getUserSettings: (state) => state.userSettings,
  },

  actions: {
    async initializeAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      this.user = session?.user || null
      if (this.user) {
        await this.initializeUserSettings()
      }
    },

    async signUp(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        return { data, error: null }
      } catch (error) {
        return { data: null, error }
      } finally {
        this.loading = false
      }
    },

    async signIn(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        this.user = data.user
        await this.initializeUserSettings()
        return { data, error: null }
      } catch (error) {
        return { data: null, error }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        // Clear all browser data first
        await this.clearBrowserData()

        // Then sign out from Supabase
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Clear user state
        this.user = null
        this.userSettings = null

        return { error: null }
      } catch (error) {
        console.error("Sign out error:", error)
        return { error }
      }
    },

    async loadUserSettings() {
      if (!this.user) return

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", this.user.id)
        .single()

      if (!error) {
        this.userSettings = data
      }
    },

    async initializeUserSettings() {
      if (!this.user) return

      try {
        const { data: existingSettings, error: fetchError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("id", this.user.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError
        }

        if (!existingSettings) {
          const { data: newSettings, error: insertError } = await supabase
            .from("user_settings")
            .insert([
              {
                id: this.user.id,
                display_name: this.user.email?.split("@")[0],
                preferences: {
                  theme: "light",
                  fontSize: "medium",
                },
              },
            ])
            .select()
            .single()

          if (insertError) throw insertError
          this.userSettings = newSettings
        } else {
          this.userSettings = existingSettings
        }
      } catch (error) {
        console.error("Error initializing user settings:", error)
      }
    },

    async updateUserSettings(updates) {
      if (!this.user) return

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session) throw new Error("No active session")

        const updateData = {
          id: this.user.id,
          display_name: updates.display_name || "",
          preferences: {
            theme: updates.preferences.theme || "light",
            fontSize: updates.preferences.fontSize || "medium",
          },
        }

        const { data, error } = await supabase
          .from("user_settings")
          .upsert(updateData, {
            onConflict: "id",
            returning: "representation",
          })
          .select()
          .single()

        if (error) {
          console.error("Upsert error:", error)
          throw error
        }

        this.userSettings = data
        return data
      } catch (error) {
        console.error("Error updating user settings:", error)
        throw error
      }
    },

    async handleLogin() {
      // ... existing login code ...

      // Load user's notes after successful login
      const notesStore = useNotesStore()
      await notesStore.loadUserNotes()
    },

    async signInWithProvider(provider) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        return { data, error: null }
      } catch (error) {
        console.error("Provider sign-in error:", error)
        return { data: null, error }
      } finally {
        this.loading = false
      }
    },

    async handleAuthCallback() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) throw error

      if (session) {
        this.user = session.user
        console.log("Session user:", this.user)
        await this.initializeUserSettings()
      }
    },

    async clearBrowserData() {
      try {
        // Clear localStorage
        localStorage.clear()

        // Clear sessionStorage
        sessionStorage.clear()

        // Clear Supabase cache
        await supabase.auth.clearSession()

        // Reset store state
        this.$reset()

        // Clear IndexedDB (if you're using it)
        const databases = await window.indexedDB.databases()
        databases.forEach((db) => {
          window.indexedDB.deleteDatabase(db.name)
        })

        return { error: null }
      } catch (error) {
        console.error("Error clearing browser data:", error)
        return { error }
      }
    },

    // Add a force refresh method
    async forceRefresh() {
      await this.clearBrowserData()
      window.location.reload(true) // Force reload from server
    },
  },
})
