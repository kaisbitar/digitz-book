<template>
  <v-btn @click="onSubmit" block size="large" :disabled="isDisabled">
    <span v-show="checkedItemsCount === 0"> رتل جميع الكلمات </span>

    <span v-show="checkedItemsCount > 0" class="font-weight-bold">
      {{ checkedItemsCount }}
      <v-scale-transition>
        <v-badge
          :key="checkedItemsCount"
          :content="checkedItemsCount.toString()"
          offset-y="-9"
          offset-x="-20"
          :color="badgeType === 'ratl' ? 'word-count' : 'verse-count'"
        >
          <template v-slot:badge>
            <div class="custom-badge">
              {{ btnText }}
            </div>
          </template>
        </v-badge>
      </v-scale-transition>
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
  btnText: {
    type: String,
    default: "رتل",
  },
  badgeType: {
    type: String,
    default: "ratl",
  },
})

const emit = defineEmits(["submit"])

const checkedItemsCount = computed(() => props.checkedItems.length)

const onSubmit = () => {
  emit("submit")
}
</script>
