<template>
  <v-app>
    <button @click="increaseFontSize">Increase Font Size</button>
    <button @click="decreaseFontSize">Decrease Font Size</button>
  </v-app>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const dynamicFontSize = computed({
  get: () => {
    return store.getFontSize
  },
  set: (value) => {
    store.setFontSize(value)
  },
})

const increaseFontSize = () => {
  const currentSize = parseFloat(dynamicFontSize.value)
  dynamicFontSize.value = `${currentSize + 2}px`
}

const decreaseFontSize = () => {
  const currentSize = parseFloat(dynamicFontSize.value)
  dynamicFontSize.value = `${Math.max(currentSize - 2, 10)}px`
}

watch(dynamicFontSize, (newSize) => {
  document.documentElement.style.setProperty("--dynamic-font-size", newSize)
  document.documentElement.style.setProperty("font-size", newSize)
})
onMounted(() => {
  //   document.documentElement.style.setProperty(
  //     "--dynamic-font-size",
  //     dynamicFontSize.value
  //   )
  //   document.documentElement.style.setProperty("font-size", dynamicFontSize.value)
})
</script>

<style lang="scss">
@import "@/styles/styles.scss";
html {
  font-size: var(--dynamic-font-size);
}
</style>
