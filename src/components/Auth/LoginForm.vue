<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              label="البريد الإلكتروني"
              type="email"
              autocomplete="email"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="كلمة المرور"
              type="password"
              autocomplete="current-password"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              block
              :loading="authStore.loading"
            >
              تسجيل الدخول
            </v-btn>

            <div class="mt-4 text-center">
              ليس لديك حساب؟
              <v-btn
                variant="text"
                color="primary"
                @click="router.push('/register')"
                :disabled="authStore.loading"
              >
                انشاء حساب
              </v-btn>
            </div>

            <v-alert v-if="error" type="error" class="mt-3">
              {{ error }}
            </v-alert>

            <!--    <v-divider class="my-4">
              <v-chip variant="text">or</v-chip>
            </v-divider>

            <v-btn
              block
              variant="outlined"
              color="primary"
              :loading="authStore.loading"
              :disabled="authStore.loading"
              @click="handleGoogleLogin"
              class="mb-4"
            >
              <v-icon start icon="mdi-google" class="mr-2"></v-icon>
              {{ authStore.loading ? "Signing in..." : " Google" }}
            </v-btn>

            <v-btn
              block
              variant="outlined"
              color="primary"
              :loading="authStore.loading"
              :disabled="authStore.loading"
              @click="handleFacebookLogin"
              class="mb-4"
            >
              <v-icon start icon="mdi-facebook" class="mr-2"></v-icon>
              {{ authStore.loading ? "Signing in..." : " Facebook" }}
            </v-btn> -->

            <v-btn
              color="warning"
              variant="text"
              size="small"
              @click="handleReset"
              class="mt-4"
            >
              مشكلة بتسجيل الدخول؟ انقر هنا
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
const showResetButton = ref(false)

const handleSubmit = async () => {
  error.value = ""
  const { data, error: authError } = await authStore.signIn(
    email.value,
    password.value
  )

  if (authError) {
    error.value = authError.message
    console.log(authError)
    return
  }

  router.push("/tafsiri")
}

const handleGoogleLogin = async () => {
  try {
    const { error } = await authStore.signInWithProvider("google", {
      redirectTo: "https://rusul.net/auth/callback",
    })
    window.location.href = "https://rusul.net/auth/callback"

    if (error) throw error
  } catch (error) {
    console.error("Google sign-in error:", error)
  }
  window.location.href = "/auth/callback"
}

const handleFacebookLogin = async () => {
  try {
    const { error } = await authStore.signInWithProvider("facebook")
    if (error) throw error
  } catch (error) {
    console.error("Facebook sign-in error:", error)
  }
}

// Show reset button after a failed login attempt
const handleLoginError = () => {
  showResetButton.value = true
}

const handleReset = async () => {
  try {
    await authStore.forceRefresh()
  } catch (error) {
    console.error("Reset error:", error)
    // As a last resort, redirect to login with a clean slate
    window.location.href = "/login"
  }
}
</script>

<style scoped></style>
