import { computed, ref, onMounted, onUnmounted, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"
import { useDisplay } from "vuetify"

export function useWindow(elementRef) {
  const store = useQuranStore()
  const goTo = useGoTo()
  const { mobile } = useDisplay()

  const windowHeight = computed(() => window.innerHeight)
  const windowWidth = computed(() =>
    window.innerWidth <= 1300 ? "small" : "large"
  )

  const drawerWidthDetail = computed(() => {
    return 550
  })
  const drawerWidthNoDetail = computed(() => {
    return 250
  })

  const dynamicHeight = ref(0)

  const setContainerHeight = () => {
    // const buffer = mobile.value ? 60 : 5
    const buffer = 0
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

  const scrollToActiveItem = async (activeItem, container) => {
    const isDialog = store.getIsDialog
    await scrollToItem(activeItem, container, isDialog)
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
  })

  return {
    windowHeight,
    setContainerHeight,
    dynamicHeight,
    scrollToActiveItem,
    windowWidth,
    drawerWidthDetail,
    drawerWidthNoDetail,
  }
}
