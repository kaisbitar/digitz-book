<template>
  <div class="d-flex">
    <v-card elevation="0" class="bg-background">
      <v-tabs
        align-tabs="center"
        mobile
        class="bg-background"
        v-model="computedTab"
      >
        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
          :value="item.name"
          :class="computedTab === item.name ? 'bg-surface' : undefined"
        >
          <v-icon
            class="ml-2"
            v-if="item.icon"
            :icon="computedTab === item.name ? item.activeIcon : item.icon"
          ></v-icon>
          <span>{{ item.title }}</span>
        </v-tab>
      </v-tabs>
    </v-card>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(["update:activeTab"])

const computedTab = computed({
  get: () => props.activeTab,
  set: (newValue) => emit("update:activeTab", newValue),
})
</script>

<style scoped>
:deep(.v-tab__slider) {
  display: none;
}

:deep(.v-tab:not(.v-tab--selected)) {
  opacity: 0.45;
}
</style>
