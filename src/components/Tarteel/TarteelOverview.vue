<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <TarteelOverviewHeader :selectedTarteel="currentTarteel" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="tarteel-overview-overflow">
        <TarteelSearchResults
          :search="currentTarteel"
          :searchIndex="0"
          :selectedRatlIndex="selectedRatlIndex"
          :isOriginal="true"
          @select="handleRatlSelect"
          @deleteRatl="deleteRatl"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { watch, nextTick, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"
import TarteelOverviewHeader from "./TarteelOverviewHeader.vue"
import TarteelSearchResults from "./TarteelSearchResults.vue"

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

const currentView = computed(() => route.query.view)
const selectedRatlIndex = computed(() => tarteelStore.selectedRatlIndex)

const currentTarteel = computed(() => {
  if (!props.selectedTarteel) return { results: [] }
  return props.selectedTarteel
})

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
  height: calc(100vh - 170px);
  overflow: auto;
}

.additional-search {
  border-top: 1px solid var(--v-border-color);
  padding-top: 1rem;
}
</style>
