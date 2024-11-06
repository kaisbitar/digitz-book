<template>
  <v-menu location="bottom end">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :color="authStore.isAuthenticated ? 'primary' : 'default'"
        variant="text"
        icon
        class="px-2"
      >
        <v-avatar size="32">
          <v-icon v-if="!authStore.userSettings?.display_name">
            mdi-account
          </v-icon>
          <span v-else>
            {{ getInitials(authStore.userSettings.display_name) }}
          </span>
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="!authStore.isAuthenticated" :to="{ name: 'Login' }">
        <template v-slot:prepend>
          <v-icon>mdi-login</v-icon>
        </template>
        <v-list-item-title>تسجيل الدخول</v-list-item-title>
      </v-list-item>

      <template v-else>
        <v-list-item :to="{ name: 'Profile' }">
          <template v-slot:prepend>
            <v-icon>mdi-account-circle</v-icon>
          </template>
          <v-list-item-title>الملف الشخصي</v-list-item-title>
        </v-list-item>

        <!-- <v-list-item :to="{ name: 'SettingsTest' }">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>الإعدادات</v-list-item-title>
        </v-list-item> -->

        <v-divider></v-divider>

        <v-list-item @click="handleLogout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>تسجيل الخروج</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const getInitials = (name) => {
  if (!name) return ""
  return name.slice(0, 1)
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push({ name: "Home" })
}
</script>
