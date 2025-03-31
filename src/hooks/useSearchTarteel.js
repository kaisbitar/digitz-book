import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"

const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

export function useSearchTarteel() {
  const setTarteel = async (tarteel, word) => {
    tarteelStore.setStoredTarteels({
      inputText: word,
      results: tarteel,
    })
    tarteelStore.setSelectedRatlIndex(0)
    tarteelStore.setSelectedRatl(tarteel[0])
    tarteelStore.addToTarteelHistory(word)
  }

  return {
    setTarteel,
  }
}
