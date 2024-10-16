<template>
  <v-app>
    <appNavigation v-if="activeRoute !== 'home'" />
    <v-main>
      <v-container class="">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)

onMounted(() => {})
</script>

<style lang="scss"></style>
