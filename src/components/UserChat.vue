<template>
  <v-card class="d-flex flex-column" height="100%">
    <!-- Chat Messages -->
    <v-card-text class="flex-grow-1 overflow-y-auto">
      <v-timeline density="compact">
        <v-timeline-item
          v-for="message in messages"
          :key="message.id"
          :dot-color="message.isAI ? 'primary' : 'success'"
          size="small"
        >
          <v-card :color="message.isAI ? 'primary' : 'success'" theme="dark">
            <v-card-text>
              {{ message.content }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <!-- Input Area -->
    <v-card-actions class="pa-4">
      <v-text-field
        v-model="userInput"
        placeholder="اكتب رسالتك..."
        append-inner-icon="mdi-send"
        @click:append-inner="sendMessage"
        @keyup.enter="sendMessage"
        hide-details
        :loading="loading"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
})

const userInput = ref("")
const loading = ref(false)
const messages = ref([])

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  loading.value = true
  try {
    // Add user message
    messages.value.push({
      id: Date.now(),
      content: userInput.value,
      isAI: false,
    })

    // Clear input
    const userMessage = userInput.value
    userInput.value = ""

    // Simulate AI response
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        content: `Responding to your message about "${props.word}": ${userMessage}`,
        isAI: true,
      })
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error("Failed to send message:", error)
    loading.value = false
  }
}
</script>
