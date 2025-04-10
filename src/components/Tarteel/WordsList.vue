<template>
  <div>
    <WordsListHeader :selectedTarteel="selectedTarteel" class="mb-4" />
    <v-divider class="mx-auto" width="100%"></v-divider>
    <WordMeaning
      :word="selectedTarteel.inputText"
      :isWordMeaningOpen="isWordMeaningOpen"
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : ''"
      @click="isWordMeaningOpen = !isWordMeaningOpen"
    />
    <WordsListResults
      class="tarteel-overview-overflow px-sm-4 mt-1"
      :search="selectedTarteel"
      :selectedRatlIndex="selectedRatlIndex"
      :isOriginal="true"
      @select="handleRatlSelect"
      @deleteRatl="deleteRatl"
    />
  </div>
</template>

<script setup>
import { watch, nextTick, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"

const route = useRoute()
const store = useStore()
const tarteelStore = useTarteelStore()
const { scrollToActiveItem } = useWindow()

const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(["ratl-selected"])

const isWordMeaningOpen = ref(false)

const currentView = computed(() => route.query.view)
const selectedRatlIndex = computed(() => tarteelStore.selectedRatlIndex)

const handleRatlSelect = (ratl, index) => {
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(index)

  store.setTarget(ratl.verses[0])
  emit("ratl-selected")
}

const deleteRatl = (index, childIndex = null) => {
  tarteelStore.removeRatl(index, childIndex)
  tarteelStore.setSelectedRatlIndex(index)
}

const overviewScroll = async () => {
  await nextTick()
  scrollToActiveItem(".active-word-card-item", ".tarteel-overview-overflow")
}

watch(currentView, () => overviewScroll())
watch(selectedRatlIndex, async () => {
  await nextTick()
  overviewScroll()
})

onMounted(() => {
  overviewScroll()
})
</script>

<style scoped>
.tarteel-overview-overflow {
  height: calc(85vh - 170px);
  overflow: auto;
}

.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
