<template>
  <v-btn @click="onSubmit" block size="large" :disabled="isDisabled">
    <span v-show="checkedItemsCount === 0"> رتل جميع الكلمات </span>

    <span v-show="checkedItemsCount > 0" class="font-weight-bold">
      <v-scale-transition>
        <v-badge
          :key="checkedItemsCount"
          :content="checkedItemsCount.toString()"
          offset-y="-9"
          offset-x="20"
          color="red"
        >
          <template v-slot:badge>
            <div class="custom-badge">
              {{ checkedItemsCount }}
            </div>
          </template>
        </v-badge>
      </v-scale-transition>
      رتل
    </span>
  </v-btn>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  checkedItems: {
    type: Array,
    default: () => [],
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["submit"])

const checkedItemsCount = computed(() => props.checkedItems.length)

const onSubmit = () => {
  emit("submit")
}
</script>
