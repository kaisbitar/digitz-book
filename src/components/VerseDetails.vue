<template>
  <v-dialog
    :modelValue="modelValue"
    fullscreen
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside="handleClose"
  >
    <template #default="{ isActive }">
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <VerseToolTip :verse="verse" />
        <AppCountChips
          :wordCount="countVerseWords(verse)"
          :letterCount="countVerseLetters(verse)"
          verse
        />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"

const emit = defineEmits(["update:modelValue"])
const { countVerseWords, countVerseLetters } = useCounting()

const props = defineProps({
  modelValue: Boolean,
  verse: String,
})

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss"></style>
