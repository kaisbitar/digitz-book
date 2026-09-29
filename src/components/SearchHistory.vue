<template>
  <!-- mousedown.prevent keeps focus in the search box while clicking a row -->
  <v-card variant="flat" class="border rounded-lg" @mousedown.prevent>
    <v-card-title class="d-flex align-center text-subtitle-1">
      <v-icon icon="mdi-history" size="20" class="ml-2" />
      عمليات البحث
    </v-card-title>
    <v-divider />
    <v-list class="py-0 history-list overflow-y-auto">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :active="item.id === selectedId"
        color="primary"
        :title="item.inputText"
        @click="emit('select', item)"
      >
        <template #append>
          <v-chip size="x-small" class="ml-2">
            {{ item.results?.length || 0 }}
          </v-chip>
          <v-btn
            variant="text"
            icon="mdi-close"
            size="x-small"
            @click.stop="emit('remove', item)"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(["select", "remove"])
</script>

<style scoped>
.history-list {
  max-height: 40vh;
}
</style>
