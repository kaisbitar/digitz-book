<template>
  <div style="max-height: 90vh; overflow-y: auto">
    <UploadButton @fileData="handleFileData" />
    <FieldPicker
      v-if="jsonData"
      :jsonData="jsonData"
      @select="handleFieldSelect"
    />
    <PromptBuilder
      v-if="selectedField"
      :selectedField="selectedField"
      :sampleValues="sampleValues"
      @update:prompt="handlePromptUpdate"
    />
    <v-btn
      v-if="selectedField"
      color="primary"
      class="mt-4"
      @click="processData"
      :loading="loading"
      :disabled="loading"
    >
      Process Data
    </v-btn>

    <ResultsPanel :responses="responses" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import UploadButton from "./UploadButton.vue"
import FieldPicker from "./FieldPicker.vue"
import PromptBuilder from "./PromptBuilder.vue"
import ResultsPanel from "./ResultsPanel.vue"

const jsonData = ref(null)
const selectedField = ref(null)
const sampleValues = ref([])
const promptTemplate = ref("")
const loading = ref(false)
const responses = ref([])

const OLLAMA_API = "http://127.0.0.1:11434/api/generate"

const handleFileData = (data) => {
  jsonData.value = data
  selectedField.value = null
  sampleValues.value = []
  responses.value = []
}

const findValuesForField = (obj, field) => {
  const values = []

  const traverse = (item) => {
    if (!item) return

    if (item[field] !== undefined) {
      values.push(item[field])
      return
    }

    if (Array.isArray(item)) {
      item.forEach(traverse)
      return
    }

    if (typeof item === "object") {
      Object.values(item).forEach(traverse)
    }
  }

  traverse(obj)
  return values
}

const handleFieldSelect = (field) => {
  selectedField.value = field
  if (jsonData.value) {
    const values = findValuesForField(jsonData.value, field)
    sampleValues.value = values.filter(Boolean).slice(0, 5)
  }
}

const handlePromptUpdate = (prompt) => {
  console.log(prompt)
  promptTemplate.value = prompt
}

async function callOllama(prompt) {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.1:latest",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant specialized in analyzing Arabic text and Quranic verses. Always provide detailed and accurate analysis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false, // Changed to false for simpler handling
      }),
    })

    const data = await response.json()
    return data.message?.content || data.response || "No response received"
  } catch (error) {
    console.error("Error calling Ollama:", error)
    throw error
  }
}

async function processData() {
  if (!jsonData.value) return

  loading.value = true
  responses.value = []

  try {
    const values = findValuesForField(jsonData.value, selectedField.value)
      .filter(Boolean)
      .slice(0, 5)

    for (const value of values) {
      try {
        const prompt = promptTemplate.value.replace("{value}", value)
        const response = await callOllama(prompt)
        responses.value.push({
          value,
          prompt,
          response,
        })
      } catch (error) {
        responses.value.push({
          value,
          prompt: promptTemplate.value.replace("{value}", value),
          response: `Error: ${error.message || "Failed to get response"}`,
        })
        console.error(`Error processing value "${value}":`, error)
      }
    }
  } catch (error) {
    console.error("Error processing data:", error)
    responses.value.push({
      value: "System Error",
      prompt: "Model initialization",
      response: `Error: ${error.message || "Failed to process data"}`,
    })
  } finally {
    loading.value = false
  }
}
</script>
