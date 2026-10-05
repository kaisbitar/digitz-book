<template>
  <v-navigation-drawer
    :model-value="drawerState"
    @update:model-value="updateDrawerState"
    :width="550"
    :location="'left'"
  >
    <v-toolbar dark>
      <div class="sura-index-search mr-3">
        <AppInputField
          variant="outlined"
          bg-color="surface"
          density="compact"
          :modelValue="search"
          fieldPlaceHolder="ابحث عن سورة"
          :dataToShow="indexData.length - 1"
          type="QuranCount"
          @update:modelValue="updateSearchValue"
        />
      </div>
    </v-toolbar>

    <Table
      :isIndexItem="true"
      class="index-container"
      :activeItemClass="'active-index-item'"
      :tableData="indexData"
      :tableInputText="search"
      :tableHeaders="indexHeaders"
      :fieldPlaceHolder="'السور'"
      :activeItemKey="targetedFileName"
      :tableHeight="'calc(100vh - 64px - 48px - 8px)'"
      @rowClicked="handleSelectedSura"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useDisplay } from "vuetify"
import { buildVerseObject } from "@/utils/suraUtils"
const { scrollToActiveItem } = useWindow()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useStore()
const dataStore = useDataStore()
const display = useDisplay()

const drawerState = computed(() => store.getIndexDrawer)

const updateDrawerState = (value) => {
  store.setIndexDrawer(value)
}

const indexData = computed(() => dataStore.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "index" }, //Must be called index
  { title: "السورة", key: "suraName" },
  { title: "الآيات", key: "numberOfVerses" },
  { title: "كلمات", key: "numberOfWords" },
  { title: "حروف", key: "numberOfLetters" },
  { title: "مصحف", key: "verseNumberToQuran" },
])
const QuranOneFile = computed(() => dataStore.getOneQuranFile)
const activeRoute = computed(() => router.currentRoute.value.name)
const targetedFileName = computed(() => {
  return store.getTarget.fileName
})

const isMobile = computed(() => {
  return display.mobile.value
})

const handleSelectedSura = (sura) => {
  if (activeRoute !== "sura") {
    router.push({ name: "sura" })
  }
  if (isMobile.value) {
    store.setIndexDrawer(false)
  }
  if (sura.fileName === targetedFileName.value) return

  if (sura.fileName !== "000المصحف") {
    const verseObject = buildVerseObject(getFirstVerse(sura.fileName))
    store.setTarget(verseObject)
    return
  }
  store.setTarget({ fileName: "000المصحف" })
}

const getFirstVerse = (fileName) => {
  const verse = QuranOneFile.value.find(
    (file) => file.fileName === fileName && file.verseIndex === 1,
  )

  return verse
}

watch(targetedFileName, () => {
  scrollToActiveItem(`.active-index-item`, `.index-container .v-table__wrapper`)
})

onMounted(() => {
  scrollToActiveItem(".active-index-item", ".index-container .v-table__wrapper")
})
</script>

<style>
.index-container .v-table__wrapper {
  overflow-x: hidden !important;
}

.sura-index-search {
  width: calc(100% / 1.618);
  flex-shrink: 0;
}

.sura-index-search .v-input__control {
  flex-grow: 1;
}

.sura-index-search .v-input__append {
  display: none;
}

.sura-index-search .v-field {
  font-size: 0.875rem;
}
</style>
