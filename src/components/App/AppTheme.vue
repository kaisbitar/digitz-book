<template>
  <v-radio-group
    v-model="selectedTheme"
    @update:modelValue="setTheme"
    mandatory
    color="primary"
  >
    <v-radio
      v-for="option in themeOptions"
      :key="option.value"
      :value="option.value"
      color="primary"
    >
      <template v-slot:label>
        <span class="d-flex align-center">
          <v-icon
            end
            class="me-4"
            :color="option.color"
            :class="{ 'text-h5': selectedTheme === option.value }"
          >
            {{ option.icon }}
          </v-icon>
          {{ option.label }}
        </span>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup>
import { useTheme } from "vuetify"
import { ref, onMounted, watch } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { useStore } from "@/stores/appStore"

const authStore = useAuthStore()
const appStore = useStore()
const theme = useTheme()
const selectedTheme = ref(appStore.getCurrentTheme)

const themeOptions = [
  {
    value: "light",
    label: "نهار",
    icon: "mdi-white-balance-sunny",
    color: "yellow",
  },
  {
    value: "dark",
    label: "ليل",
    icon: "mdi-moon-waning-crescent",
    color: "grey-darken",
  },
  {
    value: "testing",
    label: "لون ليلي",
    icon: "mdi-palette",
    color: "grey-darken",
  },
  {
    value: "testing2",
    label: "لون نهاري",
    icon: "mdi-palette",
    color: "grey-darken",
  },
]

const setTheme = async () => {
  theme.global.name.value = selectedTheme.value
  await appStore.updatePreferences({ theme: selectedTheme.value })
}

onMounted(async () => {
  if (
    !authStore.isAuthenticated ||
    !authStore.userSettings?.preferences?.theme
  ) {
    selectedTheme.value = appStore.getCurrentTheme
    setTheme()
    return
  }

  selectedTheme.value = authStore.userSettings.preferences.theme

  setTheme()
})

watch(selectedTheme, setTheme)
</script>

<style scoped></style>
