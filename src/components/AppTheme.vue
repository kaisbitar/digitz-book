<template>
  <v-radio-group
    v-model="selectedTheme"
    @update:modelValue="changeTheme"
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

const theme = useTheme()
const selectedTheme = ref("light")

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
  { value: "system", label: "نظام", icon: "mdi-monitor", color: "grey-darken" },
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

const changeTheme = () => {
  if (selectedTheme.value === "system") {
    theme.global.name.value = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light"
  } else {
    theme.global.name.value = selectedTheme.value
  }
}

const watchSystemTheme = () => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (selectedTheme.value === "system") {
        theme.global.name.value = e.matches ? "dark" : "light"
      }
    })
}

onMounted(() => {
  selectedTheme.value = theme.global.current.value.dark ? "dark" : "light"
  watchSystemTheme()
})

watch(selectedTheme, changeTheme)
</script>

<style scoped></style>
