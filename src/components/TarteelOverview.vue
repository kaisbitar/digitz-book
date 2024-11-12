<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <TarteelOverviewHeader :selectedTarteel="selectedTarteel" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="tarteel-overview-overflow">
        <!-- Original search -->
        <TarteelSearchResults
          :search="selectedTarteel"
          :searchIndex="0"
          :selectedRatlIndex="tarteelStore.selectedRatlIndex"
          :selectedSearchIndex="tarteelStore.selectedSearchIndex"
          :isOriginal="true"
          @select="handleRatlSelect"
          @deleteRatl="deleteRatl"
        />

        <!-- Additional searches -->
        <TarteelSearchResults
          v-for="(search, index) in selectedTarteel.searches?.slice(1) || []"
          :key="`search-${index}`"
          :search="search"
          :searchIndex="index + 1"
          :selectedRatlIndex="tarteelStore.selectedRatlIndex"
          :selectedSearchIndex="tarteelStore.selectedSearchIndex"
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
import WordCardItem from "./WordCardItem.vue"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"
import TarteelOverviewHeader from "./TarteelOverviewHeader.vue"
import TarteelSearchResults from "./TarteelSearchResults.vue"

const route = useRoute()
const currentView = computed(() => route.query.view)
const { scrollToActiveItem } = useWindow()

const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(["ratl-selected"])
const tarteelStore = useTarteelStore()
const store = useStore()

const handleRatlSelect = (ratl, index, searchIndex = 0) => {
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(index)
  tarteelStore.setSelectedSearchIndex(searchIndex)
  emit("ratl-selected")
}

const deleteRatl = (index, searchIndex = 0) => {
  tarteelStore.removeRatl(index, searchIndex)
  tarteelStore.setSelectedRatlIndex(index)
  tarteelStore.setSelectedSearchIndex(searchIndex)

  const currentSearch =
    searchIndex === 0
      ? props.selectedTarteel.results
      : props.selectedTarteel.searches[searchIndex].results

  tarteelStore.setSelectedRatl(currentSearch[index])
  store.setTarget(currentSearch[index].verses[0])
}

const overviewScroll = async () => {
  await nextTick()
  scrollToActiveItem(".active-word-card-item", ".tarteel-overview-overflow")
}

watch(currentView, () => overviewScroll())

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
