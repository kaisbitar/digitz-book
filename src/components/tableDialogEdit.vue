<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline ml-1">{{ suraName }}</span> -
        <span class="headline mr-1">آية رقم: {{ verseIndex }}</span>
      </v-card-title>
      عدد الكلمات: {{ numberOfWords }} عدد الحروف: {{ numberOfLetters }}
      <v-card-text>
        <v-textarea v-model="localText" label="حرر الآية"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps(['showEditVerse', 'suraName', 'verseIndex', 'verseText'])
const emit = defineEmits(['close'])

const localText = ref('')

const close = () => {
  emit('close')
}

const save = () => {
  // Implement save logic here
}

const numberOfWords = computed(() => {
  if (!localText.value) return 0
  return localText.value.trim().split(' ').length
})

const numberOfLetters = computed(() => {
  return localText.value.split(' ').join('').length
})

onMounted(() => {
  localText.value = props.verseText
})
</script>
