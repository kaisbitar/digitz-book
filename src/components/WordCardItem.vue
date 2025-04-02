<template>
  <v-card
    class="px-4 py-2 text-right"
    border
    rounded
    hover
    @click="$emit('select', ratl, index)"
    @mouseover="showDelete = false"
    @mouseleave="showDelete = false"
  >
    <div class="text-h6">
      <v-btn
        icon="mdi-close"
        size="x-small"
        variant="tonal"
        class="float-left"
        v-show="showDelete"
        @click.stop="$emit('deleteRatl', index)"
      />
      <v-icon
        icon="mdi-file-outline"
        :color="selectedRatlIndex === index ? 'primary' : 'grey'"
        size="20"
        class="pe-2 count-key-item"
      />
      {{ ratl.word }}
    </div>

    <div class="d-flex text-center mt-2 pl-5">
      <template v-for="(item, i) in cardStats" :key="i">
        <div class="text-caption" style="width: 70px">
          {{ item.label }}
        </div>
      </template>
    </div>

    <div class="d-flex text-center mb-3 pl-5">
      <template v-for="(item, i) in cardStats" :key="i">
        <div class="count-key-item font-weight-bold" style="width: 70px">
          {{ item.value }}
        </div>
      </template>
    </div>

    <div
      class="d-flex flex-wrap mt-2 mb-2 overflow-y-auto"
      style="height: 70px"
    >
      <template v-for="surah in ratl.suras" :key="surah">
        <v-chip class="text-caption ml-1 mt-1" color="secondary">
          {{ surah }}
        </v-chip>
      </template>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue"
import { useCounting } from "@/mixins/counting"
const { calculateValue } = useCounting()
import { useTarteelStore } from "@/stores/tarteelStore"

const tarteelStore = useTarteelStore()

const props = defineProps({
  ratl: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const selectedRatlIndex = computed(() => tarteelStore.getSelectedRatlIndex)

const cardStats = computed(() => [
  { value: props.ratl.verses.length, label: "آية" },
  { value: props.ratl.uniqueSuraCount, label: "سورة" },
  { value: props.ratl.word.length, label: "حروف" },
  { value: calculateValue(props.ratl.word), label: "مرقوم" },
])

const showDelete = ref(false)

defineEmits(["select", "deleteRatl"])
</script>

<style scoped></style>
