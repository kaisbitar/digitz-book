<template>
  <v-card variant="outlined" class="pill-group verses-tile d-flex flex-column">
    <v-card-title class="text-grey-darken-1 text-subtitle-1">
      آيات {{ word }} ({{ verses.length }})
    </v-card-title>
    <div
      ref="overflow"
      class="pill-group-overflow flex-grow-1 px-sm-4"
      @scroll="onScroll"
    >
      <VerseCardItem
        v-for="(verse, index) in verses"
        :item="verse"
        :key="verse.originalIndex ?? verse.verseNumberToQuran"
        :index="index"
        :textToHighlight="textToHighlight"
        :exact="exact"
        :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
        :class="{
          'active-verse-text':
            parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
        }"
        @click="emit('verseSelected', verse)"
      />
      <div class="mt-5 mb-6 text-center">صدق الله العظيم</div>
    </div>
  </v-card>
</template>

<script setup>
import VerseCardItem from "@/components/Verse/VerseCardItem.vue"

const props = defineProps({
  word: {
    type: String,
    default: "",
  },
  verses: {
    type: Array,
    default: () => [],
  },
  textToHighlight: {
    type: String,
    default: "",
  },
  exact: {
    type: Boolean,
    default: false,
  },
  targetedVerseIndex: {
    type: [String, Number],
    default: 0,
  },
  handleInfiniteScroll: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(["verseSelected"])
const overflow = ref(null)

const onScroll = (event) => {
  props.handleInfiniteScroll(event)
}

const scrollToActive = async () => {
  await nextTick()
  const container = overflow.value
  const active = container?.querySelector(".active-verse-text")
  if (!container || !active) return

  const top =
    active.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  container.scrollTop = Math.max(0, top - 8)
}

watch(() => [props.verses, props.targetedVerseIndex], scrollToActive)
onMounted(scrollToActive)

</script>

<style scoped>
.verses-tile {
  min-height: 0;
  overflow: hidden;
}

/* Verses tile spans two grid columns so it is wider than the pill tiles */
@media (min-width: 601px) {
  .verses-tile {
    grid-column: span 2;
  }
}

.verses-tile > .pill-group-overflow {
  min-height: 0;
  overflow-y: auto;
}
</style>
