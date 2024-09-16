<template>
  <div class="appSearchBox d-flex">
    <v-text-field
      v-model="search"
      :label="'ابحث عن ' + dataType"
      append-inner-icon="mdi-magnify"
      clearable
      variant="outlined"
      density="compact"
    >
      <template #prepend-inner>
        <appSearchBoxMatch
          :search="search"
          :matchingStatus="matchingStatus"
          @clicked="toggleMatching"
        />
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import appSearchBoxMatch from './appSearchBoxMatch.vue'

const props = defineProps(['dataType', 'inputText'])
const emit = defineEmits(['searchChanged', 'matchChanged'])

const store = useQuranStore()
const search = ref(props.inputText)
const matchingStatus = ref(false)

const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)

const matchChanged = () => {
  emit('matchChanged', [search.value, matchingStatus.value])
}

const toggleMatching = () => {
  matchingStatus.value = !matchingStatus.value
  matchChanged()
}

watch(search, newValue => {
  emit('searchChanged', newValue)
})

watch(
  () => props.inputText,
  newValue => {
    search.value = newValue
  },
)

watch(selectedSearchIndex, () => {
  matchingStatus.value = false
  matchChanged()
})

onMounted(() => {
  search.value = props.inputText
  matchingStatus.value = false
  matchChanged()
})
</script>

<style>
.appSearchBox {
  width: 219px;
  position: relative;
  z-index: 5;
  background: #7fffd400 !important;
}
.matchLabel {
  text-align: center;
  font-size: 10px;
  position: inherit;
  margin-left: -26px;
  margin-top: -2px;
  background: #d6d6d673;
}
.v-icon {
  cursor: pointer;
}
</style>
