/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { ar } from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          'highlight': '#ffff00', 
          'on-highlight': '#000000', 
          'v-field--variant-solo':'#6a6a6a',
          'hover-color': '#EEEEEE',   
        },
      },
      dark: {
        colors: {
          'highlight': '#ffff00',
          'v-field--variant-solo':'#6a6a6a',
          'on-highlight': '#000000', 
          'hover-color': '#3F3F3F',   
        },
      },
    },
  },
  locale: {
    locale: 'ar',
    fallback: 'ar',
    messages: { ar },
  },
})
