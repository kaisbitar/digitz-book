<template>
  <v-card-title class="d-flex align-center justify-space-between">
    <div class="d-flex align-center">
      {{
        analysisType === "exact"
          ? "تحليل الثنائيات الحرفية المتساوية"
          : analysisType === "duality"
          ? "تحليل الثنائيات الحرفية المتتابعة"
          : analysisType === "nineteen"
          ? "تحليل القسمة على 19"
          : "تحليل القسمة على الأعداد"
      }}
    </div>
    <div class="d-flex align-center">
      <v-btn-toggle
        :model-value="analysisType"
        @update:model-value="$emit('update:type', $event)"
        mandatory
        class="me-2"
      >
        <v-btn value="exact" size="small">متساوية</v-btn>
        <v-btn value="duality" size="small">متتابعة</v-btn>
        <v-btn value="nineteen" size="small">19</v-btn>
        <v-btn value="divisibility" size="small">الأعداد</v-btn>
      </v-btn-toggle>
    </div>
  </v-card-title>
</template>

<script setup>
defineProps({
  analysisType: {
    type: String,
    required: true,
  },
})

defineEmits(["update:type"])
</script>
