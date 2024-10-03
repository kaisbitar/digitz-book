<template>
  <v-menu offset-y :close-on-content-click="false" :nudge-width="200">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon size="small">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(component, index) in components" :key="index">
        <component :is="component" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const props = defineProps({
  components: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped></style>
