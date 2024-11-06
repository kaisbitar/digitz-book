<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="pa-4">
          <v-card-title>Profile</v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-email</v-icon>
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{
                  authStore.user?.email
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-clock</v-icon>
                </template>
                <v-list-item-title>Member Since</v-list-item-title>
                <v-list-item-subtitle>{{
                  formatDate(authStore.user?.created_at)
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" @click="handleLogout"> Logout </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  console.log(authStore.userSettings)
})

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString()
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push("/login")
}
</script>
