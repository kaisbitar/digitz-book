<template>
  <v-card variant="outlined" class="pill-group d-flex flex-column">
    <v-card-title class="text-grey-darken-1 text-subtitle-1">
      {{ title }} ({{ items.length }})
    </v-card-title>
    <div class="pill-group-overflow flex-grow-1">
      <div class="d-flex flex-wrap align-content-start ga-3 pa-3">
        <v-chip
          v-for="item in items"
          :key="item.word"
          :color="chipColor(item)"
          :variant="chipVariant(item)"
          size="large"
          class="pl-0"
          @click="emit('select', item)"
        >
          <span class="ml-1">{{ item.word }}</span>
          <span class="text-caption text-grey-darken-1">
            ({{ item.verses.length }})
          </span>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            class="mr-1"
            @click.stop="emit('remove', item)"
          />
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  selectedWord: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["select", "remove"])

// Exact matches stay primary. Derivatives stay grey. The open word is outlined.
const chipColor = (item) => {
  if (item.group === "exact" || item.word === props.selectedWord) return "primary"
  return "grey-darken-2"
}

const chipVariant = (item) => {
  if (item.word === props.selectedWord) return "outlined"
  if (item.group === "exact") return "flat"
  return "tonal"
}
</script>

<style scoped>
.pill-group {
  min-height: 0;
}

.pill-group-overflow {
  min-height: 0;
  overflow-y: auto;
}
</style>
