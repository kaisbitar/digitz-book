<template>
  <v-menu location="top" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        icon="mdi-grain"
        variant="text"
        size="small"
        title="ضبط الحبيبات"
      />
    </template>
    <v-list density="compact" class="pa-3" min-width="300">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-caption text-medium-emphasis">ضبط الحبيبات</span>
        <v-btn variant="text" size="small" @click="reset">افتراضي</v-btn>
      </div>
      <v-slider
        v-for="item in CYMATICS_FIELDS"
        :key="item.key"
        v-model="tune[item.key]"
        :label="`${item.label} ${tune[item.key].toFixed(2)}`"
        :min="item.min"
        :max="item.max"
        :step="item.step"
        hide-details
        density="compact"
        color="primary"
      />
    </v-list>
  </v-menu>
</template>

<script setup>
import { CYMATICS_DEFAULTS, CYMATICS_FIELDS } from "@/utils/cymatics"

// The live physics object, owned by useCymatics and passed straight through.
const tune = defineModel({ type: Object, required: true })

const reset = () => Object.assign(tune.value, CYMATICS_DEFAULTS)
</script>
