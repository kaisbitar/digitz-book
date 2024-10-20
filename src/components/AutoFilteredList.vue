<template>
  <v-sheet class="d-flex flex-column" height="100%">
    <v-list class="flex-grow-1 overflow-y-auto">
      <!-- <v-list-subheader class="sticky-top"> Tarteel Results </v-list-subheader> -->
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-title
          >{{ item.word }} ({{ item.count }})</v-list-item-title
        >
        <template v-slot:append>
          <v-btn
            @click="emitAddItem(item)"
            color="success"
            class="ml-2"
            size="small"
            variant="text"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            @click="removeItem(index)"
            color="error"
            size="small"
            variant="text"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
    <v-sheet class="pa-4">
      <v-btn @click="saveChanges" color="primary" variant="text">
        رتل الجميع
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  initialItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["update:items", "save", "add-item"])

const items = ref([...props.initialItems])

watch(
  () => props.initialItems,
  (newItems) => {
    items.value = [...newItems]
  }
)

const emitAddItem = (item) => {
  emit("add-item", item)
}

const removeItem = (index) => {
  items.value.splice(index, 1)
  emit("update:items", items.value)
}

const saveChanges = () => {
  emit("save", items.value)
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgb(var(--v-theme-background));
}
</style>
