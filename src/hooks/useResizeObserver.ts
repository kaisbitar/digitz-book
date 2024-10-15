import { onMounted, onUnmounted, ref, Ref } from "vue"

interface ResizeHandlerOptions {
  elementRef?: Ref<HTMLElement | null>
  updateHeight?: () => void
  breakpointThreshold?: number
}

export function useResizeHandler(options: ResizeHandlerOptions = {}) {
  const { elementRef, updateHeight, breakpointThreshold = 900 } = options

  const screen = ref<"mobile" | "desktop">(
    window.innerWidth < breakpointThreshold ? "mobile" : "desktop"
  )
  let resizeObserver: ResizeObserver | null = null

  const handleResize = () => {
    screen.value =
      window.innerWidth < breakpointThreshold ? "mobile" : "desktop"
    updateHeight?.()
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize)

    if (elementRef?.value && updateHeight) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight()
      })
      resizeObserver.observe(elementRef.value)
    }

    handleResize()
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    screen,
    handleResize,
  }
}
