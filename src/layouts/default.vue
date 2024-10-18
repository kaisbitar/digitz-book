<template>
  <v-app>
    <AppNav v-if="activeRoute !== 'home'" />
    <v-main>
      <v-container max-width="1200" class="px-2 px-sm-10 pb-0" fluid>
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
