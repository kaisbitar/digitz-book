<template>
  <AppDialog :modelValue="modelValue" transition="fab">
    <AutoComplete v-click-outside="handleClose" class="mt-1" />
  </AppDialog>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()
const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean,
})
const searchResults = computed(() => store.getResearchResults)

const handleClose = () => {
  if (searchResults.value.length === 0) {
    store.setActiveRoute("sura")
    router.push(`/sura`)
  }
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
