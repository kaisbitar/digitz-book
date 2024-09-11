<template>
  <v-card outlined>
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="auto" class="mr-2">
        <v-chip class="wordLabel orange lighten-4" label>
          {{ detailElement }}
        </v-chip>
      </v-col>
      <v-col cols="auto" class="mr-2">
        <v-chip class="dashInfoLabel grey lighten-5" label>
          {{ detailCount }}
          <span class="verseInfoLabel mr-1">مرة</span>
        </v-chip>
      </v-col>
      <v-col cols="auto" class="mr-2">
        <v-chip class="dashInfoLabel grey lighten-5" label>
          {{ detailElement.length }}
          <span class="verseInfoLabel mr-1">حروف</span>
        </v-chip>
      </v-col>
    </v-row>
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
      persistent
      scrim="white"
      :opacity="0.8"
    >
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script setup>
defineProps({
  detailElement: String,
  detailCount: Number,
  detailsData: Object,
  isLoading: Boolean,
})
</script>

<style scoped>
.wordLabel {
  font-size: 25px !important;
  width: 130px;
  text-align: center;
  margin-left: 20px;
  display: block;
}
.dashInfoLabel {
  font-size: 20px !important;
}
</style>
