<template>
  <v-btn
    :class="activeRoute === 'sura' ? 'selected' : 'not-selected'"
    @click="$emit('navigateTo', 'sura')"
    icon
    size="small"
  >
    <v-icon>mdi-book-open-variant</v-icon>
  </v-btn>

  <v-btn
    :class="activeRoute === 'search' ? 'selected' : 'not-selected'"
    @click="$emit('navigateTo', 'search')"
    icon
    size="small"
  >
    <v-icon>mdi-magnify</v-icon>
  </v-btn>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useQuranStore } from "@/stores/app"
import { defineEmits } from "vue"

defineEmits(["navigateTo"])
defineProps(["activeRoute"])
</script>

<style></style>
