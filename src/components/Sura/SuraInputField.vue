<template>
  <v-card class="d-flex">
    <v-col cols="auto" class="mr-auto">
      <v-btn
        icon="mdi-arrow-left"
        variant="tonal"
        size="small"
        clickable
        @click="goBack()"
      ></v-btn>
    </v-col>
    <v-col :cols="$vuetify.display.smAndUp ? 8 : 12">
      <AppInputField
        v-model="localSearch"
        :fieldPlaceHolder="placeholderText"
        :hasError="hasError"
        :hasSuccess="hasSuccess"
        variant="outlined"
        @update:modelValue="onInput"
        @keydown:enter="onEnter"
      >
        <template v-slot:append-inner-input-items>
          <span v-if="inputIndex > 0">
            {{ badgeContent }}/{{ inputIndex }}
          </span>
        </template>
        <template v-slot:append-input-items>
          <v-btn
            v-for="btn in inputNavigation"
            :key="btn.icon"
            :class="[btn.class]"
            :icon="btn.icon"
            :tabindex="btn.tabindex"
            variant="tonal"
            size="small"
            clickable
            @click="btn.action"
          ></v-btn>
        </template>
      </AppInputField>
    </v-col>
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  search: String,
  placeholderText: String,
  badgeContent: String,
  inputIndex: Number,
})

const emit = defineEmits([
  "update:search",
  "enter",
  "navigate-up",
  "navigate-down",
  "clear",
])

const router = useRouter()
const localSearch = ref(props.search || "")
const hasError = ref(false)
const hasSuccess = ref(false)

watch(
  () => props.search,
  (newValue) => {
    localSearch.value = newValue
  }
)

const onInput = async (value) => {
  localSearch.value = value
  hasError.value = false
  hasSuccess.value = false
  emit("update:search", value)

  nextTick(() => {
    if (parseInt(props.badgeContent) > 0) {
      hasError.value = false
      hasSuccess.value = true
      return
    }
    hasError.value = true
    hasSuccess.value = false
  })
}

const onEnter = () => {
  emit("enter", localSearch.value)
}

const handleClickUp = () => {
  emit("navigate-up")
}

const handleClickDown = () => {
  emit("navigate-down")
}

const onClear = () => {
  localSearch.value = ""
  emit("clear")
  emit("update:search", "")
}

const goBack = () => {
  router.push({ path: "/tarteel", query: { view: "detail" } })
}

const inputNavigation = computed(() => [
  {
    icon: "mdi-chevron-up",
    class: "ml-1",
    tabindex: -1,
    action: handleClickUp,
  },
  {
    icon: "mdi-chevron-down",
    class: "ml-1",
    tabindex: -1,
    action: handleClickDown,
  },
  {
    icon: "mdi-close",
    class: "ml-1",
    action: onClear,
  },
  {
    icon: "mdi-arrow-left",
    class: "mx-0",
    action: goBack,
  },
])
</script>

<style scoped></style>
