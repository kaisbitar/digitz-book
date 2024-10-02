import { computed, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"
import { he } from "vuetify/locale"

export function useWindow(props) {
  const store = useQuranStore()
  const goTo = useGoTo()

  const windowHeight = computed(() => window.innerHeight)
  const dynamicTableHeight = ref(0)

  const updateTableHeight = (height) => {
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
        duration: 300,
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

  const breakpoint = ref(window.innerWidth < 900 ? "mobile" : "desktop")
  const currentBreakpoint = computed(() => breakpoint.value)

  const updateBreakpoint = () => {
    breakpoint.value = window.innerWidth < 900 ? "mobile" : "desktop"
  }

  window.addEventListener("resize", updateBreakpoint, updateTableHeight)

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateBreakpoint, updateTableHeight)
  })

  return {
    windowHeight,
    updateTableHeight,
    dynamicTableHeight,
    scrollToActiveItem,
    scrollNoDialog,
    currentBreakpoint,
  }
}
