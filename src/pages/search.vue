<template>
  <div>
    <AutoComplete />
    <h1 class="ml-10">{{ inputText }}</h1>
    <SearchBoard
      v-if="!isLoading"
      :inputText="inputText"
      :isLoading="isLoading"
      :versesBasics="versesData"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useQuranStore } from "@/stores/app";

const store = useQuranStore();
const props = defineProps(["activeView"]);

const isLoading = ref(false);

const selectedSearchIndex = computed(() => store.getSelectedSearchIndex);
const selectedSearch = computed(() =>
store.getResearchResults ? store.getSelectedSearch : {}
);
const inputText = computed(() =>
selectedSearch.value ? selectedSearch.value.inputText : undefined
);
const versesBasics = computed(() =>
selectedSearch.value ? selectedSearch.value.result : []
);
const versesData = computed(() => versesBasics.value.map((item) => {
    return {
      fileName: item.raw.fileName,
      verseIndex: item.raw.verseIndex.toString(),
      verseText: item.raw.verseText,
      numberOfWords: item.raw.verseText.split(" ").length.toString(),
      numberOfLetters: item.raw.verseText.replace(/ /g, "").length.toString(),
      verseNumberToQuran: item.raw.verseNumberToQuran.toString(),
    };
  }));

  onMounted(() => {
  if (selectedSearchIndex.value === -1) {
    store.setSearchIndex();
  }
  store.setActiveRoute("search");
  store.setActiveView("detailView");
});
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
