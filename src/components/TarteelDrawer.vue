<template>
  <v-navigation-drawer v-model="localDrawer" location="left" width="250">
    <v-toolbar dark>
      <v-toolbar-title>تراتيل</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="localDrawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expansion-panels>
      <v-expansion-panel v-for="(item, index) in storedTarteels" :key="index">
        <v-expansion-panel-title>
          {{ item.inputText }}
          <template v-slot:actions>
            <v-badge :content="item.results.length" color="wordCount"></v-badge>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-virtual-scroll :items="item.results" height="200" item-height="40">
            <template v-slot:default="{ item }">
              <v-badge
                :content="item.count"
                color="wordCount"
                offset-x="5"
                offset-y="10"
              >
                <v-chip class="ma-1">{{ item.word }}</v-chip>
              </v-badge>
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useTarteelStore } from "@/stores/tarteelStore"

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["update:drawer"])

const tarteelStore = useTarteelStore()

const localDrawer = ref(props.drawer)

watch(
  () => props.drawer,
  (newValue) => {
    localDrawer.value = newValue
  }
)

watch(localDrawer, (newValue) => {
  emit("update:drawer", newValue)
})

const storedTarteels = computed(() => {
  // Assuming tarteelStore has a method to get stored tarteel
  return tarteelStore.getStoredTarteels
})
</script>
