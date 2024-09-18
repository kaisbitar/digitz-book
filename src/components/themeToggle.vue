<template>
  <v-btn-toggle v-model="activeTheme" mandatory class="theme-toggle">
    <v-btn value="light" size="small" class="circular-btn">
      <v-icon :color="isDark ? 'grey' : 'yellow'">mdi-white-balance-sunny</v-icon>
    </v-btn>
    <v-btn value="dark" size="small" class="circular-btn">
      <v-icon :color="isDark ? 'blue-grey' : 'grey'">mdi-moon-waning-crescent</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { computed, ref, watch } from 'vue'

const theme = useTheme()

const isDark = computed(() => theme.global.current.value.dark)
const activeTheme = ref(isDark.value ? 'dark' : 'light')

watch(activeTheme, newValue => {
  theme.global.name.value = newValue
})
</script>

<style scoped>
.theme-toggle {
  margin-left: 15px;
}

.circular-btn {
  border-radius: 50% !important;
  aspect-ratio: 1 / 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
