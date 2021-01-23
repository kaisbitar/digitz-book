import Vue from 'vue'
import Vuetify, { VBtn, VAutocomplete, VDataTable, VIcon, VApp, VAppBar, VRow, VCol, VOverlay, VProgressCircular, VCard, VChip, VChipGroup } from 'vuetify/lib'
import ar from 'vuetify/es5/locale/ar'

Vue.use(Vuetify, {
  components: { VBtn, VAutocomplete, VDataTable, VIcon, VApp, VAppBar, VRow, VCol, VOverlay, VProgressCircular, VCard, VChip, VChipGroup }
})

export default new Vuetify({
  rtl: true,
  lang: {
    locales: { ar },
    current: 'ar'
  }
})
