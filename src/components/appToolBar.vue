<template>
  <v-toolbar color="surface">
    <h3 class="ml-10">{{ title }}</h3>
    <DashboardTabs
      :tabs="tabs"
      :activeTab="activeTab"
      @tabChanged="changeTab"
      class="webKitWidth mb-"
    />
  </v-toolbar>
</template>

<script setup>
import { computed } from 'vue'
import { useQuranStore } from '@/stores/app'

const props = defineProps({
  title: String,
  tabs: Array,
})

const store = useQuranStore()

const activeTab = computed({
  get: () => store.getActiveTab,
  set: value => store.setActiveTab(value),
})

const changeTab = tab => {
  store.setActiveTab(tab)
}
</script>

<style></style>
