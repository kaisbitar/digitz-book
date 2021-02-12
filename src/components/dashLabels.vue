<template>
  <div class="mr-2" outlined>
    <div class="d-flex ml-1 pa-2 pr-0 pt-0" outlined>
      <v-card class=" display-3 text-center pa-3" outlined>
        <div class="mt-n1">{{ detailElement }}</div>
      </v-card>
      <span class="display-3 mr-2 ml-2 mt-3">:</span>
      <v-card class=" d-flex text-center pa-3" outlined>
        <span class="display-3">{{ detailCount }}</span>
        <div class="mt-7">مرة</div>
      </v-card>
    </div>
     <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
  </div>
</template>

<script>
export default {
  name: 'dashLabelsPositions',
  props: [
    'detailElement',
    'detailCount',
    'detailsData',
    'isLoading'
  ]
}
</script>

<style>
.wordItem {
  margin: 5px;
  padding: 5px;
  border: 1px solid #bebebe;
  border-radius: 3px;
  background: #efefef8c;
  width: 70px;
  text-align: center;
}
.wordItemWrap {
  overflow-y: scroll;
  max-height:270px;
}
</style>
