<template>
  <v-list-item>
    <v-list-item-title>
      {{ item.word }}
      <v-badge
        :content="`${item.count} مرة في القرأن`"
        floating
        offset-x="-20"
        offset-y="-1"
        color="wordCount"
      ></v-badge>
    </v-list-item-title>
    <template v-slot:append>
      <v-btn
        @click="$emit('add-item', item)"
        icon="mdi-magnify"
        size="small"
        class="ml-2"
        variant="text"
      ></v-btn>
      <v-btn
        @click="$emit('add-item', item)"
        icon="mdi-plus"
        size="small"
        class="ml-2"
        variant="text"
      ></v-btn>
      <v-btn
        @click="$emit('remove-item', item)"
        icon="mdi-minus"
        size="small"
        variant="text"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(["add-item", "remove-item"])
</script>
