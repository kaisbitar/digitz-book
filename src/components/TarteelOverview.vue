<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card variant="flat">
          <v-card-item>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar size="48">
                  <v-icon icon="mdi-database-search-outline" size="24" />
                </v-avatar>
              </v-col>
              <v-col>
                <v-card-title
                  ><span>ترتيل</span> "{{
                    selectedTarteel.inputText
                  }}"</v-card-title
                >
                {{ selectedTarteel.results.length || 0 }}
                <span class="text-caption count-key-item"> رتل </span>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="tarteel-overview-overflow">
        <WordCardItem
          v-for="(ratl, index) in selectedTarteel.results"
          :class="{
            'active-word-card-item': tarteelStore.selectedRatlIndex === index,
          }"
          :key="index"
          :ratl="ratl"
          :index="index"
          @select="handleRatlSelect"
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

const handleRatlSelect = (ratl, index) => {
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(index)
  emit("ratl-selected")
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
</style>
