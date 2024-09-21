<template>
  <Verses
    class="webKitWidth"
    :versesBasics="versesBasics"
    :inputText="inputText"
    :isLoading="isLoading"
    @verseSelected="runSelectedSura"
  />
  <v-dialog v-model="showSuraText" width="4000">
    <template v-slot:default="{ isActive }">
      <v-sheet class="pa-10 hide-overflow position-relative">
        <v-btn
          icon="mdi-arrow-right"
          size="small"
          class="mt-n10 ml-20"
          @click="isActive.value = false"
        ></v-btn>
        <Sura :inputText="inputText" />
      </v-sheet>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuranStore } from "@/stores/app";
import Sura from "@/pages/Sura.vue";

const props = defineProps(["versesBasics", "inputText", "isLoading"]);
const store = useQuranStore();

const suraTextArray = ref([]);
const showSuraText = ref(false);

const oneQuranFile = computed(() => store.getOneQuranFile);

const runSelectedSura = (verse) => {
  const fileName = verse.fileName;
  suraTextArray.value = [];
  oneQuranFile.value.forEach((item) => {
    if (item.fileName === fileName) {
      suraTextArray.value.push(item.verseText);
    }
  });
  showSuraText.value = true;
};

onMounted(() => {});
</script>

<style>
.chartTitleWrap {
  zoom: 0.8;
  position: absolute;
  z-index: 3;
  margin-top: 3px !important;
  margin-right: 250px;
}
a.dashTabs.v-tab--active {
  background: aliceblue;
}
.hide-overflow {
  overflow: hidden !important;
}
</style>
