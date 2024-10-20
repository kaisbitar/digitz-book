<template>
  <v-sheet class="d-flex flex-column" height="100%"
    ><v-list class="flex-grow-1 overflow-y-auto">
      <v-virtual-scroll :items="items" height="300" item-height="50">
        <template v-slot:default="{ item, index }">
          <v-list-item>
            <v-list-item-title>
              {{ item.word }}
              <v-badge
                :content="`${item.count} مرة`"
                floating
                offset-x="-20"
                offset-y="-1"
                color="wordCount"
              ></v-badge>
            </v-list-item-title>
            <template v-slot:append>
              <v-btn
                @click="emitAddItem(item)"
                icon="mdi-magnify"
                size="small"
                class="ml-2"
                variant="text"
              ></v-btn>
              <v-btn
                @click="emitAddItem(item)"
                icon="mdi-plus"
                size="small"
                class="ml-2"
                variant="text"
              ></v-btn>

              <v-btn
                @click="removeItem(item)"
                icon="mdi-minus"
                size="small"
                variant="text"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list>
    <v-sheet class="pa-4">
      <v-btn @click="saveChanges" color="primary" variant="tonal">
        رتل الجميع
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  items: {
    type: Object,
    required: false,
  },
  totalCount: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits(["update:items", "save", "add-item"])

const emitAddItem = (item) => {
  emit("add-item", item)
}

const removeItem = (index) => {
  props.items.value.splice(index, 1)
  emit("update:items", props.items.value)
}

const saveChanges = () => {
  emit("save", props.items.value)
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
