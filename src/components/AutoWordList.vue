<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card
      v-for="groupType in visibleGroups"
      :key="groupType"
      variant="outlined"
      class="mb-2 flex-grow-0"
    >
      <v-card-title class="mb-2 text-grey-darken-1 text-subtitle-1">
        {{ getGroupTitle(groupType) }} ({{ getGroupItems(groupType).length }})
      </v-card-title>
      <v-card-text style="overflow-y: auto; width: 100%; display: flex; flex-wrap: wrap; gap: 12px; align-content: flex-start;">
        <v-chip
          v-for="item in getGroupItems(groupType)"
          :key="item.word"
          :color="item.word === selectedWord ? 'primary' : 'grey-darken-2'"
          variant="tonal"
          size="large"
          class="pl-0"
          @click="emit('select', item)"
        >
          <span class="ml-1">{{ item.word }}</span>
          <span class="text-caption text-grey-darken-1"
            >({{ item.verses.length }})</span
          >
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            class="mr-1"
            @click.stop="removeItem(item)"
          />
        </v-chip>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedWord: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["select", "update:currentWordsList"])

const getGroupTitle = (group) => {
  const root = props.items.wordRoot
  const titles = {
    exact: "مطابقة تامة",
    root: root ? `مشتقات الجذر ${root}` : "مشتقات",
    attached: "صيغ متصلة",
    other: "تشابه صوتي",
  }
  return titles[group] || group
}

const removeItem = (item) => {
  const newFilteredWords = props.items.filter((word) => word.word !== item.word)
  newFilteredWords.wordRoot = props.items.wordRoot
  newFilteredWords.word = props.items.word
  emit("update:currentWordsList", newFilteredWords)
}

const getGroupItems = (groupType) => {
  return props.items.filter((item) => (item.group || "exact") === groupType)
}

const visibleGroups = computed(() =>
  ["exact", "attached", "root", "other"].filter(
    (groupType) => getGroupItems(groupType).length
  )
)
</script>
