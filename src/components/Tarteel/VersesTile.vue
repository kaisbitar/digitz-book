<template>
  <v-card variant="outlined" class="pill-group verses-tile d-flex flex-column">
    <v-card-title class="text-grey-darken-1 text-subtitle-1">
      آيات {{ word }} ({{ verseCount }})
    </v-card-title>
    <div
      ref="overflow"
      class="pill-group-overflow flex-grow-1 px-sm-4"
      @scroll="onScroll"
    >
      <VFadeTransition group hide-on-leave>
        <VerseCardItem
          v-for="(verse, index) in verses"
          :item="verse"
          :key="`${word}-${verse.originalIndex ?? verse.verseNumberToQuran}`"
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
      </VFadeTransition>
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
  verseCount: {
    type: Number,
    default: 0,
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
const alignedTo = ref("")
let userScrolled = false
let locking = false
let retries = 0

const onScroll = (event) => {
  if (!locking) userScrolled = true
  props.handleInfiniteScroll(event)
}

const scrollToActive = async () => {
  const key = `${props.word}:${props.targetedVerseIndex}`
  if (alignedTo.value === key || userScrolled) return

  await nextTick()
  const container = overflow.value
  const active = container?.querySelector(".active-verse-text")
  if (!container || !active) {
    if (retries < 5) {
      retries += 1
      requestAnimationFrame(scrollToActive)
    }
    return
  }

  const top =
    active.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  locking = true
  alignedTo.value = key
  container.scrollTop = Math.max(0, top - 8)
  locking = false
  retries = 0
}

watch(
  () => props.word,
  () => {
    userScrolled = false
    alignedTo.value = ""
    retries = 0
    scrollToActive()
  },
)
watch(() => props.verses.length, () => {
  if (userScrolled) return
  scrollToActive()
})
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
