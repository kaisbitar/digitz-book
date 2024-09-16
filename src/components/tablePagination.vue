<template>
  <v-card class="d-flex pt-2 paginationWrapper" color="grey-lighten-5">
    <div class="itemsLength mb-2 mt-1 mr-4 ml-4">
      <span class="thisPage">هذه الصفحة: </span>
      <span class="font-weight-bold">{{ itemsLength }}</span>
      <span class="thisPage pr-1">{{ label }} </span>
    </div>
    <v-pagination
      v-model="currentPage"
      :length="computedPageCount"
      :key="computedPageCount"
      active-color="black"
      :border="'sm'"
      class="paginator"
    ></v-pagination>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  page: number
  pageCount: number
  itemsLength: number
  label: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pageChanged', value: number): void
}>()

const currentPage = ref(props.page)

// Compute pageCount to ensure reactivity
const computedPageCount = computed(() => props.pageCount)

watch(currentPage, newVal => {
  emit('pageChanged', newVal)
})
</script>

<style scoped>
/* .v-pagination {
  zoom: 0.7;
}
.itemsLength {
  font-size: 14px;
  width: 113px;
}
.paginator {
  margin-top: -3px;
}
.thisPage {
  font-size: 11px;
} */
</style>
