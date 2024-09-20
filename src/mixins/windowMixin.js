import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'

export function useWindowMixin() { 
  const store = useQuranStore()

  const windowHeight = computed(() => window.innerHeight)  
  const activeRoute = computed(() => store.getActiveMode)
  const getTableHeight = computed(() => {
    let height = windowHeight.value
    if(activeRoute.value === 'singleSura') {
      height = height - 300
    }

    if(activeRoute.value === 'search') {
        height = height - 375
    }

    return height
  })

  const getTextBoxHeight = computed(() => {
    let height = windowHeight.value
    if(activeRoute.value === 'singleSura') {
      height = height - 15
    }

    if(activeRoute.value === 'search') {
        height = height - 90
    }
    return height
  })

  return {
    windowHeight,
    getTableHeight,
    getTextBoxHeight,
  }
}
