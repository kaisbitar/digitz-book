<template>
  <div dir="rtl" class="p-6 max-w-4xl mx-auto">
    <input
      v-model="query"
      type="text"
      placeholder="ابحث في القرآن..."
      class="w-full p-3 border rounded-xl mb-4 text-right"
    />

    <!-- Checkbox Filters -->
    <div class="flex flex-wrap gap-4 mb-6 justify-end">
      <label
        v-for="(label, key) in filters"
        :key="key"
        class="flex items-center space-x-2 space-x-reverse"
      >
        <input type="checkbox" v-model="activeFilters" :value="key" />
        <span class="text-sm font-medium">{{ label }}</span>
      </label>
    </div>

    <!-- Results Clustered by Category -->
    <div
      v-for="(results, category) in filteredResults"
      :key="category"
      class="mb-6"
    >
      <h2 class="text-lg font-semibold mb-2">{{ filters[category] }}</h2>
      <ul class="bg-gray-50 p-4 rounded-xl shadow text-right">
        <li
          v-for="result in results"
          :key="result.word"
          class="py-2 border-b last:border-b-0 flex justify-between items-center"
        >
          <div>
            <span class="font-bold">{{ result.word }}</span>
            <span class="text-sm text-gray-500">({{ result.count }} آية)</span>
          </div>
          <span
            v-if="result.tag"
            class="text-xs px-2 py-1 border rounded-full bg-white shadow-sm text-gray-700"
          >
            {{ result.tag }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const query = ref("الحكمة")

const filters = {
  exact: "مطابقة تامة",
  attached: "صيغ متصلة",
  root: "الجذر والمشتقات",
  acoustic: "تشابه صوتي",
}

const activeFilters = ref(Object.keys(filters))

// Mocked data for UI testing
const mockResults = {
  exact: [{ word: "الحكمة", count: 4, tag: "مطابقة تامة" }],
  attached: [
    { word: "بالحكمة", count: 2 },
    { word: "ولحكمة", count: 1 },
    { word: "لحكمت", count: 1 },
  ],
  root: [
    { word: "حكم", count: 3 },
    { word: "محكمة", count: 2 },
    { word: "تحكموا", count: 1 },
    { word: "يحكم", count: 4 },
    { word: "يحكُمون", count: 2 },
  ],
  acoustic: [
    { word: "ورماحكم", count: 1, tag: "مشابهة" },
    { word: "ريحكم", count: 1, tag: "مشابهة" },
    { word: "يحييكم", count: 1, tag: "مشابهة" },
  ],
}

const filteredResults = computed(() => {
  return Object.fromEntries(
    Object.entries(mockResults).filter(([key]) =>
      activeFilters.value.includes(key)
    )
  )
})
</script>
