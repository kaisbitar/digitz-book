<template>
  <div class="mr-auto">
    <v-switch
      v-model="isDark"
      @change="toggleTheme"
      class="theme-switch"
      hide-details
      density="comfortable"
    >
      <template v-slot:thumb>
        <v-icon v-if="!isDark" color="grey">mdi-white-balance-sunny</v-icon>
        <v-icon v-if="isDark" color="yellow">mdi-moon-waning-crescent</v-icon>
      </template>
    </v-switch>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { ref, watch } from 'vue'

const theme = useTheme()

const isDark = ref(theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}

watch(isDark, newValue => {
  toggleTheme()
})
</script>

<style scoped>
.theme-switch {
  margin-left: 15px;
}

/* You might need to adjust the switch size to accommodate larger icons */
.theme-switch :deep(.v-switch__thumb) {
  transform: scale(0.7);
}
</style>
