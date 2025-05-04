<template>
  <div v-if="responses.length" class="mt-6">
    <h3 class="text-h6 mb-4">Results:</h3>
    <v-expansion-panels>
      <v-expansion-panel v-for="(response, index) in responses" :key="index">
        <v-expansion-panel-title>
          Value: {{ response.value }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="mb-2">
            <strong>Prompt:</strong>
            <pre>{{ response.prompt }}</pre>
          </div>
          <div>
            <strong>Response:</strong>
            <pre>{{ response.response }}</pre>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
defineProps({
  responses: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>
