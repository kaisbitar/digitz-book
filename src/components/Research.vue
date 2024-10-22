<template>
  <!-- {{ storedTarteels }} -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useTarteelStore } from "@/stores/tarteelStore"

const tarteelStore = useTarteelStore()
const props = defineProps({
  chipsTitle: String,
  chipsData: Object,
})

const storedTarteels = computed(() => {
  return tarteelStore.getStoredTarteels
})
</script>

<style scoped>
.research-row {
  max-height: 111px;
  overflow: scroll;
  position: relative;
  margin-bottom: 7px;
}
@media (max-width: 600px) {
  .flex-column {
    flex-direction: column !important;
  }
}
</style>
