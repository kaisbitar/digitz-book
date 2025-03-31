import { ref, onMounted, onUnmounted } from "vue"

export function useHideOnScroll() {
  const isVisible = ref(true)
  let lastScrollY = 0

  const onScroll = (event) => {
    const currentScroll = event.target.scrollTop
    isVisible.value = currentScroll < lastScrollY || currentScroll < 50
    lastScrollY = currentScroll
  }

  onMounted(() => {
    const scrollContainer = document.querySelector(".sura-board-overflow")
    if (!scrollContainer) return
    scrollContainer.addEventListener("scroll", onScroll, { passive: true })
  })

  onUnmounted(() => {
    const scrollContainer = document.querySelector(".sura-board-overflow")
    if (!scrollContainer) return
    scrollContainer.removeEventListener("scroll", onScroll)
  })

  return isVisible
}
