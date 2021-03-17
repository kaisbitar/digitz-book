<template>
  <div outlined>
    <div class="d-flex text-center" flat>
        <!-- <div class="wordLabel"> -->
        <v-card label class="wordLabel lighten-4 orange mr-2 elevation-0">
          {{ detailElement }}
        </v-card>
        <!-- </div> -->
        <v-chip label class="dashInfoLabel lighten-5 grey mr-2">
          {{ detailCount }}
          <span class="verseInfoLabel mr-1">
            مرة
          </span>
        </v-chip>
        <v-chip label class="dashInfoLabel lighten-5 grey mr-2">
          {{ detailElement.length }}
          <span class="verseInfoLabel mr-1">
            حروف
          </span>
        </v-chip>
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
.wordLabel{
  font-size: 25px !important;
  width: 130px;
  text-align: center;
  margin-left: 20px;
  display: block;
}
.dashLabelsWrap{
  margin-top: 22px;
  margin-bottom: -27px;
}
.dashInfoLabel{
  font-size: 20px !important;
}
</style>
