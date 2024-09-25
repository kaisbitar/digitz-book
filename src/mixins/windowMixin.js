import { computed, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"

export function useWindowMixin(props) {
  const store = useQuranStore()
  const goTo = useGoTo()

  const windowHeight = computed(() => window.innerHeight)

  const dynamicTableHeight = ref(0)
  const updateTableHeight = async (height) => {
    await nextTick()
    dynamicTableHeight.value = window.innerHeight - height
  }

  const scrollToItem = async (activeItem, container, isDialog) => {
    await nextTick()
    setTimeout(() => {
      const activeRowSelector = isDialog
        ? `.v-dialog ${activeItem}`
        : `${activeItem}`

      const activeVerseItem = document.querySelector(activeRowSelector)
      if (!activeVerseItem) return
      const baseContainer = isDialog ? `.v-dialog ${container}` : `${container}`
      goTo(activeVerseItem, {
        container: baseContainer,
        offset: -100,
        duration: 400,
        easing: "easeInOutCubic",
      })
    }, 100)
  }

  const scrollNoDialog = async (activeItem, container) => {
    await scrollToItem(activeItem, container, false)
  }

  const scrollToActiveItem = async (activeItem, container) => {
    const isDialog = store.getIsDialog
    await scrollToItem(activeItem, container, isDialog)
  }

  return {
    windowHeight,
    updateTableHeight,
    dynamicTableHeight,
    scrollToActiveItem,
    scrollNoDialog,
  }
}
