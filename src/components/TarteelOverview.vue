<template>
  <v-container fluid>
    <!-- Search Stats Summary -->
    <v-row>
      <v-col cols="12">
        <v-card variant="flat">
          <v-card-item>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar color="primary" size="48">
                  <v-icon icon="mdi-book-search" size="24" />
                </v-avatar>
              </v-col>
              <v-col>
                <v-card-title>نتائج البحث</v-card-title>
                <v-card-subtitle>
                  {{ selectedTarteel?.length || 0 }} كلمات تم العثور عليها
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ratl Results -->
    <v-row>
      <v-col cols="12">
        <v-expansion-panels variant="popout">
          <v-expansion-panel
            v-for="(ratl, index) in selectedTarteel"
            :key="index"
            :value="index"
          >
            <v-expansion-panel-title>
              <v-row no-gutters>
                <v-col cols="4">
                  <div class="text-h6">{{ ratl?.word }}</div>
                </v-col>
                <v-col cols="8">
                  <v-chip-group>
                    <v-chip color="primary" size="small">
                      {{ ratl?.verses?.length || 0 }} آيات
                    </v-chip>
                    <v-chip color="secondary" size="small">
                      {{ ratl?.count || 0 }} مرات
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-card variant="flat">
                <!-- Preview of first verse with null check -->
                <v-card-text v-if="ratl?.verses?.length" class="text-right">
                  {{ ratl.verses[0].verseText }}
                </v-card-text>
                <v-card-text v-else class="text-right">
                  لا توجد آيات
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="handleRatlSelect(ratl)"
                  >
                    عرض التفاصيل
                    <v-icon end icon="mdi-chevron-right" />
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  selectedTarteel: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "word" in item &&
            "verses" in item &&
            Array.isArray(item.verses)
        )
      )
    },
  },
})

const emit = defineEmits(["selectRatl"])

const handleRatlSelect = (ratl) => {
  if (ratl) {
    emit("selectRatl", ratl)
  }
}
</script>
