<template>
  <v-btn
    @click="onSubmit"
    block
    size="x-large"
    :disabled="isDisabled"
    color="primary"
    variant="outlined"
  >
    <span class="">
      ترتيل
      <v-scale-transition>
        <span :key="checkedItemsCount">
          ({{ checkedItemsCount }} {{ btnText }})
        </span>
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
  allItems: {
    type: Array,
    default: () => [],
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  btnText: {
    type: String,
    default: "كلمة",
  },
  badgeType: {
    type: String,
    default: "ratl",
  },
})

const emit = defineEmits(["submit"])

const checkedItemsCount = computed(() =>
  props.checkedItems.length > 0
    ? props.checkedItems.length
    : props.allItems.length
)

const onSubmit = () => {
  emit("submit")
}
</script>
