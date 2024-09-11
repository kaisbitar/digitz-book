<template>
  <v-card outlined class="d-flex pt-2 paginationWrapper" color="grey lighten-5">
    <div class="currentItemsLength mb-2 mt-1 mr-4 ml-4">
      <span class="thisPage">هذه الصفحة: </span>
      <span class="font-weight-bold">{{ currentItemsLength }}</span>
      <span class="thisPage pr-1">{{ label }} </span>
    </div>
    <v-pagination
      v-model="pageLocal"
      :length="pageCount"
      color="brown lighten-4 black--text font-weight-bold"
      class="paginator"
    ></v-pagination>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  page: Number,
  pageCount: Number,
  currentItemsLength: Number,
  label: String,
})

const emit = defineEmits(['pageChanged'])

const pageLocal = ref(1)

watch(
  () => pageLocal.value,
  newValue => {
    emit('pageChanged', newValue)
  },
)

watch(
  () => props.page,
  newValue => {
    pageLocal.value = newValue
  },
)

onMounted(() => {
  pageLocal.value = props.page
})
</script>

<style>
ul.v-pagination.theme--light {
  zoom: 0.7;
}
.currentItemsLength {
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
