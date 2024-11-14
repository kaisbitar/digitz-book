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
      <v-icon icon="mdi-file-outline" size="20" class="pe-2 count-key-item" />
      <span class="text-h6">{{ ratl.word }}</span>
    </div>

    <template v-for="(item, i) in cardStats" :key="i">
      <div>
        <span>{{ item.value }}</span>
        <small class="ms-2 count-key-item">{{ item.label }}</small>
      </div>
    </template>
    <slot name="actions"></slot>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue"
import { useCounting } from "@/mixins/counting"
const { calculateValue } = useCounting()

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
