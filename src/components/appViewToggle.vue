<template>
  <div class="mr-auto">
    <v-switch v-model="isDetailView" @change="changeView" class="viewSwitch" hide-details>
      <template v-slot:thumb>
        <v-icon v-if="!isDetailView">mdi-text</v-icon>
        <v-icon v-if="isDetailView">mdi-table</v-icon>
      </template>
    </v-switch>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const store = useQuranStore()
const router = useRouter()

const props = defineProps({
  title: String,
})

const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const activeView = computed(() => store.getActiveView)

const isDetailView = ref(activeView.value === 'detailView')

watch(activeView, newValue => {
  isDetailView.value = newValue === 'detailView'
})

const changeView = () => {
  const newView = isDetailView.value ? 'detailView' : 'textView'
  const hasSelectedSearch = selectedSearchIndex.value > -1

  store.setActiveView(newView)

  if (!hasSelectedSearch) return

  if (newView !== 'textView') {
    checkAndGo('search')
    return
  }
  checkAndGo('singleSura')
  store.setScrollTrigger()
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
    store.setActiveRoute(route)
  }
}
onMounted(() => {})
</script>

<style></style>
