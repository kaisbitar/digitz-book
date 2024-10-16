<template>
  <v-hover v-slot="{ isHovering, props }" open-delay="100" close-delay="100">
    <v-navigation-drawer
      v-model="drawer"
      v-bind="props"
      :width="isHovering ? drawerWidthDetail : drawerWidthNoDetail"
      :location="$vuetify.display.mobile ? 'top' : 'right'"
      expand-on-hover
    >
      <v-container>
        <v-list>
          <v-card class="d-flex">
            <v-btn
              class="mt-2"
              icon
              @click="toggleDrawer"
              variant="text"
              size="small"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <AppInputField
              class="mx-2"
              :fieldInput="search"
              :fieldPlaceHolder="'السور'"
              @update:fieldInput="updateSearchValue"
            />
          </v-card>
          <Table
            :isIndexItem="true"
            class="index-container"
            :scrollingItemClass="'active-index-item'"
            :tableData="indexData"
            :tableInputText="search"
            :tableHeaders="indexHeaders"
            :fieldPlaceHolder="'السور'"
            :activeItemKey="targetedIndex"
            @rowClicked="handleSelectedSura"
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
const {
  scrollToActiveItem,
  windowWidth,
  drawerWidthDetail,
  drawerWidthNoDetail,
} = useWindow()
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

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState)
}

const handleSelectedSura = (sura) => {
  store.setTarget({
    fileName: sura.fileName,
    verseIndex: 1,
    verseNumberToQuran: sura.verseNumberToQuran.toString(),
  })

  if (windowWidth.value === "small") {
    store.setDrawerState(false)
  } else {
    store.setDrawerState(true)
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
  scrollToActiveItem(`.active-index-item`, `.index-container .v-table__wrapper`)
})

onMounted(() => {
  scrollToActiveItem(".active-index-item", ".index-container .v-table__wrapper")
})
</script>

<style scoped></style>
