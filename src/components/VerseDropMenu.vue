<template>
  <!-- <v-lazy
    :min-height="30"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  > -->
  <v-container>
    <div class="d-flex">
      <div class="verseNumChip">
        {{ item.verseIndex }}
      </div>
      <div>
        <div class="text-blue mb-n1">{{ item.fileName }}</div>
        <div v-html="highlight(item.verseText, textToHighlight)"></div>
        <div class="mt-n1 text-caption text-grey">
          ترتيب في المصحف {{ item.verseNumberToQuran }}
        </div>
      </div>
    </div>
  </v-container>
  <!-- </v-lazy> -->
</template>

<script setup>
import { useInputFiltering } from "@/mixins/inputFiltering"
const { highlight } = useInputFiltering()

const props = defineProps(["item", "textToHighlight"])
const emit = defineEmits(["verseClicked"])

const handleClick = () => {
  emit("verseClicked")
}
</script>

<style>
.verseNumChip {
  width: 53px;
  height: 28px;
  background-color: rgb(var(--v-theme-input-background));
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  margin-left: 18px;
  margin-top: 26px;
}
</style>
