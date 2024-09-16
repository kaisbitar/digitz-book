<template>
  <v-card flat>
    <v-tabs v-model="tab" height="37" grow>
      <v-tab
        v-for="(item, index) in tabs"
        v-model="item.name"
        :href="'#' + item.name"
        :key="index"
        :value="item.name"
        :title="item.title"
        @click="setActiveTab(item.name)"
      >
        {{ item.value }} {{ item.title }}
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['tabs', 'activeTab'])
const emit = defineEmits(['tabChanged'])

const tab = ref('numberOfVerses')

const setActiveTab = activeTab => {
  tab.value = activeTab
  emit('tabChanged', activeTab)
}

watch(
  () => props.activeTab,
  newActiveTab => {
    setActiveTab(newActiveTab)
  },
)

onMounted(() => {
  setActiveTab(props.activeTab)
})
</script>

<style>
.v-tab {
  font-size: 17px;
  font-family: unset;
  letter-spacing: 0;
}
.v-tab {
  height: 26px;
  margin-top: 5px;
}
</style>
