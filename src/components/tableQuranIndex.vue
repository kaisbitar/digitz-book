<template>
  <v-hover v-slot="{ isHovering, props }" open-delay="100" close-delay="100">
    <v-navigation-drawer
      v-model="localDrawer"
      v-bind="props"
      :width="isHovering || isMobile ? drawerWidthDetail : drawerWidthNoDetail"
      :location="'left'"
      expand-on-hover
    >
      <!-- <v-container> -->
      <v-toolbar dark>
        <v-toolbar-title v-if="!isInputVisible">السور</v-toolbar-title>
        <v-spacer></v-spacer
        ><AppToggleBtn
          :isActive="isInputVisible"
          inActiveIcon="mdi-magnify"
          activeIcon="mdi-arrow-right"
          size="default"
          @toggle="isInputVisible = !isInputVisible"
        />
        <AppInputField
          class="flex-grow-1 mt-n3 pr-2"
          v-if="isInputVisible"
          :fieldInput="search"
          :fieldPlaceHolder="'السور'"
          :dataToShow="indexData.length - 1"
          :type="'QuranCount'"
          @update:fieldInput="updateSearchValue"
        />
        <v-btn icon @click="localDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <Table
        :isIndexItem="true"
        class="index-container"
        :activeItemClass="'active-index-item'"
        :tableData="indexData"
        :tableInputText="search"
        :tableHeaders="indexHeaders"
        :fieldPlaceHolder="'السور'"
        :activeItemKey="targetedIndex"
        @rowClicked="handleSelectedSura"
      />
      <!-- </v-container> -->
    </v-navigation-drawer>
  </v-hover>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useDisplay } from "vuetify"

const { scrollToActiveItem, drawerWidthDetail, drawerWidthNoDetail } =
  useWindow()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useStore()
const dataStore = useDataStore()
const display = useDisplay()

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["update:drawer"])

const localDrawer = ref(props.drawer)
const isInputVisible = ref(false)
watch(
  () => props.drawer,
  (newValue) => {
    localDrawer.value = newValue
  }
)

watch(localDrawer, (newValue) => {
  emit("update:drawer", newValue)
})

const indexData = computed(() => dataStore.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "index" }, //Must be called index
  { title: "السورة", key: "suraName" },
  { title: "الآيات", key: "numberOfVerses" },
  { title: "كلمات", key: "numberOfWords" },
  { title: "حروف", key: "numberOfLetters" },
  { title: "مصحف", key: "verseNumberToQuran" },
])

const activeRoute = computed(() => router.currentRoute.value.name)

const targetedIndex = computed(() => {
  return store.getTarget.fileName
})

const isMobile = computed(() => {
  return display.mobile.value
})

const handleSelectedSura = (sura) => {
  store.setTarget({
    fileName: sura.fileName,
    verseIndex: 1,
    verseNumberToQuran: sura.verseNumberToQuran.toString(),
  })

  if (activeRoute !== "sura") {
    router.push({ name: "sura" })
  }
  if (isMobile.value) {
    localDrawer.value = false
  }

  store.setSearchIndex(-1)
}

const handleDrawer = () => {
  if (activeRoute.value === "sura" && !isMobile.value) {
    localDrawer.value = true
  } else {
    localDrawer.value = false
  }
}

watch(activeRoute, () => {
  handleDrawer()
})

onMounted(() => {
  handleDrawer()
})

watch(targetedIndex, () => {
  scrollToActiveItem(`.active-index-item`, `.index-container .v-table__wrapper`)
})

onMounted(() => {
  scrollToActiveItem(".active-index-item", ".index-container .v-table__wrapper")
})
</script>

<style scoped></style>
