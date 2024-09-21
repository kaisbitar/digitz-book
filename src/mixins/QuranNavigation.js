import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'

export function useQuranNavigation() { 
  const store = useQuranStore()

  const activeRoute = computed(() => store.getActiveRoute)  
  const activeView = computed(() => store.getActiveView)  

  const navigateToTargetedSuraAndVerse = item => {
    // if (props.targetFileName.value === '000المصحف') {
    //   const target = {
    //     fileName: '000المصحف',
    //     verseIndex: item.verseIndex,
    //     verseNumberToQuran: item.verseNumberToQuran,
    //   }
    //   store.setTarget(target)
    //   return
    // }
    // const suraNumber = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
    // const suraName = item.fileName.replace(/[0-9]/g, '')
    // store.setTarget({
    //   fileName: `${suraNumber}${suraName}`,
    //   verseIndex: item.verseIndex,
    //   verseNumberToQuran: item.verseNumberToQuran,
    // })
  }

  return {
    navigateToTargetedSuraAndVerse
  }
}
