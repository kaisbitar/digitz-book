import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ar from 'vuetify/es5/locale/ar'

Vue.use(Vuetify)

export default new Vuetify({
  rtl: true,
  lang: {
    locales: { ar },
    current: 'ar'
  }
})
