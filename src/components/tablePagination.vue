<template>
  <v-card class="d-flex pt-2 paginationWrapper">
    <div class="itemsLength mb-2 mt-1 mr-4 ml-4">
      <span class="thisPage">هذه الصفحة: </span>
      <span class="font-weight-bold">{{ itemsLength }}</span>
      <span class="thisPage pr-1">{{ label }} </span>
    </div>
    <v-pagination
      :key="paginationKey"
      v-model="currentPage"
      :length="pageCount"
      active-color="black"
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

const currentPage = computed({
  get: () => props.page,
  set: (value: number) => emit('pageChanged', value),
})

const paginationKey = ref<number>(0)

watch(
  () => props.pageCount,
  () => {
    // Increment the key to force a re-render of the pagination component
    paginationKey.value++
  },
)
</script>

<style scoped>
.v-pagination {
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
}
</style>
