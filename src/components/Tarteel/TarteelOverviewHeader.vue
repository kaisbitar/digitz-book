<template>
  <v-card variant="flat">
    <v-card-item>
      <v-row align="center" justify="space-between">
        <v-col cols="auto" class="d-flex align-center">
          <v-avatar size="48" class="me-3">
            <v-icon icon="mdi-database-search-outline" size="24" />
          </v-avatar>
          <div>
            <v-card-title class="pa-0">
              "{{ selectedTarteel.inputText }}"
            </v-card-title>
            <div class="text-body-2">
              {{ selectedTarteel.results.length || 0 }}
              <span class="text-caption count-key-item">رتل</span>
            </div>
          </div>
        </v-col>
        <v-col cols="5">
          <AutoBoard
            v-if="showAutoBoard"
            :placeholder="'أدخل رتلا'"
            :showLetterChart="false"
            :isAddingToExisting="true"
          />
          <v-btn
            v-else
            prepend-icon="mdi-plus"
            color="primary"
            variant="tonal"
            @click="handleNewSearch"
          >
            بحث جديد
          </v-btn>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref } from "vue"

defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
})

const showAutoBoard = ref(false)
const handleNewSearch = () => {
  showAutoBoard.value = true
}
</script>
