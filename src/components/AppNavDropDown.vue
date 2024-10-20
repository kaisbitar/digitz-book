<template>
  <div>
    <v-list>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon>mdi-cog-outline</v-icon>
            </template>
            <v-list-item-title>إعدادت</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item v-for="(component, index) in components" :key="index">
          <component :is="component" />
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
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
