<template>
  <div class="d-flex flex-column h-screen">
    <AppNav v-if="activeRoute !== 'home'" />
    <v-main class="flex-grow-1">
      <router-view v-slot="{ Component }">
        <!-- <v-container max-width="1200" class="pt-0 px-0"> -->
        <component :is="Component" />
        <!-- </v-container> -->
      </router-view>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)

onMounted(() => {})
</script>

<style lang="scss"></style>
