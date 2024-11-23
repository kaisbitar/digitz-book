<template>
  <v-btn @click="toggleView" icon size="small">
    <v-icon>{{ viewIcon }}</v-icon>
  </v-btn>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
import { computed } from "vue"

const store = useStore()

const isMobileView = computed({
  get: () => store.getVersesMobileView,
  set: (value) => store.setVersesMobileView(value),
})

const viewIcon = computed(() =>
  isMobileView.value ? "mdi-format-list-bulleted" : "mdi-view-list"
)

const toggleView = () => {
  isMobileView.value = !isMobileView.value
}
</script>

<style scoped></style>
