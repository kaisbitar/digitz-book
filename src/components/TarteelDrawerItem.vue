<template>
  <v-expansion-panel @click="selectItem">
    <v-expansion-panel-title @click="selectAll">
      {{ item.inputText }}
      <template v-slot:actions>
        <v-badge :content="item.results.length" color="word-count"></v-badge>
      </template>
    </v-expansion-panel-title>
    <!-- <v-expansion-panel-text>
      <v-virtual-scroll :items="item.results" height="200" item-height="40">
        <template v-slot:default="{ item }">
          <v-list lines="one">
            <v-list-item :value="item">
              <v-badge
                :content="item.count"
                color="word-count"
                offset-x="-19"
                offset-y="6"
              >
                {{ item.word }}
              </v-badge>
              <template v-slot:prepend="{ isActive }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </v-virtual-scroll>
    </v-expansion-panel-text> -->
  </v-expansion-panel>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["update:selection"])

const selectedWords = ref([])

const selectAll = () => {
  selectedWords.value = props.item.results
  updateSelection()
}

const updateSelection = () => {
  emit("update:selection", {
    inputText: props.item.inputText,
    selectedWords: selectedWords.value,
  })
}

const selectItem = () => {
  emit("update:selection", props.index)
}

watch(
  () => props.item,
  () => {
    selectedWords.value = []
  },
  { deep: true }
)
</script>
