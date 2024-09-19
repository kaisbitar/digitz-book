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
import { useTheme } from 'vuetify'

const theme = useTheme()

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

  if (newView === 'textView') {
    if (hasSelectedSearch) {
      checkAndGo('singleSura')
    }
    store.setScrollTrigger()
  } else {
    if (hasSelectedSearch) {
      checkAndGo('search')
    }
  }

  store.setActiveView(newView)
}

const checkAndGo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
  }
}
onMounted(() => {})
</script>

<style></style>
