import { computed, ref, onMounted, onUnmounted, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"

export function useWindow(elementRef) {
  const store = useQuranStore()
  const goTo = useGoTo()

  const windowHeight = computed(() => window.innerHeight)
  const windowWidth = window.innerWidth < 900 ? "small" : "large"
  const dynamicHeight = ref(0)

  const setContainerHeight = (buffer = 20) => {
    if (elementRef && elementRef.value) {
      const windowHeight = window.innerHeight
      const containerRect = elementRef.value.getBoundingClientRect()
      const containerTop = containerRect.top
      const newHeight = windowHeight - containerTop - buffer
      dynamicHeight.value = newHeight
      elementRef.value.style.height = `${newHeight}px`
    }
  }

  const handleResize = () => {
    setContainerHeight()
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

  onMounted(() => {
    window.addEventListener("resize", handleResize)
    setContainerHeight()
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
  })

  return {
    windowHeight,
    setContainerHeight,
    dynamicHeight,
    scrollToActiveItem,
    scrollNoDialog,
    windowWidth,
  }
}
