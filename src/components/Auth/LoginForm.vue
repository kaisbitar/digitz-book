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
