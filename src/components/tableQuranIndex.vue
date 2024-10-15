<template>
  <v-hover v-slot="{ isHovering, props }" open-delay="100" close-delay="100">
    <v-navigation-drawer
      v-model="drawer"
      v-bind="props"
      :width="isHovering ? 600 : 310"
      :location="$vuetify.display.mobile ? 'top' : 'right'"
    >
      <v-container>
        <v-list>
          <AppInputField
            :fieldInput="search"
            :fieldPlaceHolder="'السور'"
            @update:fieldInput="updateSearchValue"
          />
          <Table
            :tableData="indexData"
            :tableInputText="search"
            :tableHeaders="indexHeaders"
            :fieldPlaceHolder="'السور'"
            :scrollingItemClass="'active-Quran-index'"
            :scrollingContainerClass="'index-container'"
            :activeItemKey="targetedIndex"
            @activateRowItem="handleSelectedSura"
          />
        </v-list>
      </v-container>
    </v-navigation-drawer>
  </v-hover>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
const { scrollToActiveItem, windowWidth } = useWindow()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useQuranStore()

const props = defineProps(["isShowSuraDetail"])

const indexData = computed(() => store.getQuranIndex)
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

const drawer = computed({
  get: () => store.getDrawerState,
  set: (value) => store.setDrawerState(value),
})

const handleSelectedSura = (sura) => {
  store.setTarget({
    fileName: sura.fileName,
    verseIndex: 1,
    verseNumberToQuran: sura.verseNumberToQuran.toString(),
  })

  if (windowWidth === "small") {
    store.setDrawerState(false)
  }

  if (activeRoute !== "sura") {
    router.push({ name: "sura" })
  }

  store.setSearchIndex(-1)
}

const handleDrawer = () => {
  if (activeRoute.value === "sura") {
    drawer.value = true
    return
  }
  drawer.value = false
}

watch(activeRoute, () => {
  handleDrawer()
})

onMounted(() => {
  handleDrawer()
})

watch(targetedIndex, () => {
  scrollToActiveItem(
    `.active-Quran-index`,
    `.index-container .v-table__wrapper`
  )
})

onMounted(() => {
  scrollToActiveItem(
    ".active-Quran-index",
    ".index-container .v-table__wrapper"
  )
})
</script>

<style scoped></style>
