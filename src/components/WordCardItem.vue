<template>
  <v-card
    class="pa-4 text-right"
    border
    rounded
    hover
    @click="$emit('select', ratl, index)"
    @mouseover="showDelete = true"
    @mouseleave="showDelete = false"
  >
    <v-btn
      icon="mdi-close"
      size="x-small"
      variant="tonal"
      class="float-left"
      v-show="showDelete"
      @click.stop="$emit('deleteRatl', index)"
    />
    <div class="d-flex align-center mb-2">
      <v-icon
        icon="mdi-file-outline"
        :color="selectedRatlIndex === index ? 'primary' : 'grey'"
        size="20"
        class="pe-2 count-key-item"
      />
      <div class="text-h6 mr-1" color="primary">
        {{ ratl.word }}
      </div>
    </div>

    <div class="d-flex flex-wrap mt-2 overflow-y-auto" style="height: 50px">
      <div v-for="(item, i) in cardStats" :key="i">
        <span class="ml-2 text-caption">{{ item.label }}</span>
        <div class="count-key-item font-weight-bold">
          {{ item.value }}
        </div>
      </div>

      <div class="d-flex flex-wrap mt-2 overflow-y-auto" style="height: 50px">
        <template v-for="surah in ratl.suras" :key="surah">
          <v-chip class="text-caption ml-1 mt-1" color="secondary">
            {{ surah }}
          </v-chip>
        </template>
      </div>
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
