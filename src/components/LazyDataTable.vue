<script setup>
import { VDataTable } from "vuetify/components"
</script>

<template>
  <VDataTable v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData"></slot>
    </template>
  </VDataTable>
</template>
