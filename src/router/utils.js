import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"

export async function processSuraNavigation(to) {
  if (!to.params.suraNumber) return

  const store = useStore()
  const dataStore = useDataStore()

  const oneQuranFile = dataStore.getOneQuranFile
  const verseIndex = to.params.verseIndex || 1

  const verse = oneQuranFile.find(
    (item) =>
      Number(item.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, "")) ===
        Number(to.params.suraNumber) && item.verseIndex === Number(verseIndex)
  )
  if (verse) {
    store.setTarget({
      ...verse,
      tarteel: to.query.tarteel || "",
    })
  }
}
