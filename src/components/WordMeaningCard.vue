<template>
  <v-card :variant="variant" :class="cardClass">
    <v-scroll-y-transition>
      <noData
        v-if="loading"
        text="وَلَا يَأْتُونَكَ بِمَثَلٍ إِلَّا جِئْنَٰكَ بِالْحَقِّ وَأَحْسَنَ تَفْسِيرًا"
        icon="mdi-translate"
      />
    </v-scroll-y-transition>

    <v-card-item v-if="!expanded" :key="meanings[0]?.word">
      <template v-slot:prepend>
        <v-icon icon="mdi-translate" class="mx-2" />
      </template>

      <v-card-title class="ml-2 count-key-item">
        {{ meanings[0]?.word }}
      </v-card-title>
      <v-card-text class="text-truncate mb-n5">
        {{ meanings[0]?.meaning }}
      </v-card-text>
      <span class="text-caption count-key-item">
        {{ meanings[0]?.dictionary }}
      </span>
    </v-card-item>

    <v-scroll-y-transition>
      <div v-if="!loading && expanded" :key="meanings">
        <v-card-item v-for="(item, index) in meanings" :key="item.word + index">
          <v-card-title class="ml-2 count-key-item">
            {{ item.word }}
          </v-card-title>

          <v-card-text class="mb-n5">{{ item.meaning }}</v-card-text>
          <span class="text-caption count-key-item">{{ item.dictionary }}</span>

          <v-divider
            v-if="index < meanings.length - 1"
            horizontal
            length="50%"
            class="mt-7"
          />
        </v-card-item>
      </div>
    </v-scroll-y-transition>
  </v-card>
</template>

<script setup>
defineProps({
  meanings: {
    type: Array,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: true,
  },
  variant: {
    type: String,
    default: "text",
  },
  cardClass: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
  },
})
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
