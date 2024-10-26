import { Ref } from "vue"

export function useResizeHandler({
  elementRef,
  elementFunc,
}: {
  elementRef: Ref<HTMLElement | null>
  elementFunc: () => void
}) {
  let observer: ResizeObserver | null = null

  const initObserver = () => {
    if (!elementRef.value) {
      console.warn("Element reference is not available for ResizeObserver")
      return
    }

    observer = new ResizeObserver(() => {
      elementFunc()
    })

    observer.observe(elementRef.value)
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
    }
  }

  return {
    initObserver,
    cleanup,
  }
}
