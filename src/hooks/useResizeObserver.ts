import { onMounted, onUnmounted, ref, Ref } from "vue"

interface ResizeHandlerOptions {
  elementRef?: Ref<HTMLElement | null>
  elementFunc?: () => void
  breakpointThreshold?: number
}

export function useResizeHandler(options: ResizeHandlerOptions = {}) {
  const { elementRef, elementFunc } = options
  let resizeObserver: ResizeObserver | null = null

  const handleResize = () => {
    elementFunc?.()
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize)
    resizeObserver = new ResizeObserver(() => {
      elementFunc()
    })
    resizeObserver.observe(elementRef.value)
    handleResize()
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    handleResize,
  }
}
