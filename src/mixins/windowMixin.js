import { computed } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"

export function useWindowMixin() {
  const store = useQuranStore()
  const goTo = useGoTo()

  const windowHeight = computed(() => window.innerHeight)
  const activeRoute = computed(() => store.getActiveRoute)

  const getHeightAdjustment = (route) => {
    const adjustments = {
      sura: { table: 300, textBox: 15 },
      search: { table: 375, textBox: 90 },
    }
    return adjustments[route] || { table: 0, textBox: 0 }
  }

  const getTableHeight = computed(() => {
    const adjustment = getHeightAdjustment(activeRoute.value)
    return windowHeight.value - adjustment.table
  })

  const getTextBoxHeight = computed(() => {
    const adjustment = getHeightAdjustment(activeRoute.value)
    return windowHeight.value - adjustment.textBox
  })

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
    getTableHeight,
    getTextBoxHeight,
    scrollToActiveItem,
    scrollNoDialog,
  }
}
