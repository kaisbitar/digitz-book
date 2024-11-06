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

      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        :error-messages="passwordError"
      ></v-text-field>

      <v-btn
        type="submit"
        color="primary"
        block
        :loading="authStore.loading"
        :disabled="!isValid"
      >
        Register
      </v-btn>

      <v-alert v-if="error" type="error" class="mt-3">
        {{ error }}
      </v-alert>
    </v-form>

    <v-divider class="my-4"></v-divider>

    <v-btn variant="text" block :to="{ name: 'Login' }">
      Already have an account? Login
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const error = ref("")

const passwordError = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return "Passwords do not match"
  }
  return ""
})

const isValid = computed(() => {
  return (
    email.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
  )
})

const handleSubmit = async () => {
  error.value = ""
  const { data, error: authError } = await authStore.signUp(
    email.value,
    password.value
  )

  if (authError) {
    error.value = authError.message
    return
  }

  // Redirect after successful registration
  router.push("/login")
}
</script>
