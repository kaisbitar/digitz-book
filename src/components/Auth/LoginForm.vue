<template>
  <v-card class="pa-4">
    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn type="submit" color="primary" block :loading="authStore.loading">
        Login
      </v-btn>

      <v-alert v-if="error" type="error" class="mt-3">
        {{ error }}
      </v-alert>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")

const handleSubmit = async () => {
  error.value = ""
  const { data, error: authError } = await authStore.signIn(
    email.value,
    password.value
  )

  if (authError) {
    error.value = authError.message
    return
  }

  // Redirect after successful login
  router.push("/tafsiri")
}
</script>
