<template>
  <!-- <v-btn class="mx-3" variant="tonal" @click="openSearch">
    <v-icon size="x-small">mdi-magnify</v-icon>
    <span class="text-caption mx-3"> ابحث في القرآن </span>
  </v-btn> -->
  <!-- <AppDialog :modelValue="isSearchOpen" transition="fap"> -->
  <AutoComplete v-click-outside="handleClose" class="mt-1" />
  <!-- </AppDialog> -->
</template>

<script setup>
import { ref } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()
const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean,
})

const isHovered = ref(false)
const isSearchOpen = ref(false)
const searchResults = computed(() => store.getResearchResults)

const openSearch = () => {
  isSearchOpen.value = true
  emit("update:modelValue", true)
}

const handleClose = () => {
  if (searchResults.value.length === 0) {
    store.setActiveRoute("sura")
    router.push(`/sura`)
  }
  isSearchOpen.value = false
  emit("update:modelValue", false)
}
</script>

<style scoped></style>
