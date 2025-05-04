<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="triggerFileInput">
          Upload JSON File
        </v-btn>
        <input
          type="file"
          ref="fileInput"
          accept=".json"
          style="display: none"
          @change="handleFileUpload"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const emit = defineEmits(["fileData"])
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const input = event.target
  if (!input.files?.length) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      emit("fileData", data)
    } catch (error) {
      console.error("Error parsing JSON:", error)
    }
  }
  reader.readAsText(input.files[0])
}
</script>
