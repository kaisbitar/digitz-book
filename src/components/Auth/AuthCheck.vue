<template>
  <v-btn v-if="authStore.isAuthenticated" @click="handleLogout"> Logout </v-btn>
  <v-btn v-else :to="{ name: 'Login' }"> Login </v-btn>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.signOut()
  router.push("/login")
}
</script>
