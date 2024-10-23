<template>
  <v-list-item :active="isActive" @click="handleClick">
    <template v-slot:prepend>
      <v-checkbox
        :model-value="checked"
        @update:model-value="$emit('update:checked', $event)"
        hide-details
        @click.stop
      ></v-checkbox>
    </template>
    <v-list-item-title>
      {{ item.word }}
    </v-list-item-title>
    <template v-slot:append>
      <v-badge
        :content="item.count"
        floating
        offset-x="50"
        offset-y="-1"
        color="word-count"
      ></v-badge>
    </template>
  </v-list-item>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["add-item", "remove-item", "update:checked"])

const isActive = ref(false)

const toggleActive = () => {
  isActive.value = !isActive.value
}

const handleClick = () => {
  toggleActive()
  emit("update:checked", !props.checked)
}
</script>
