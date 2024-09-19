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
      // defaultTheme: 'light',
      themes: {
        // Use 'surface' for app background color,
        light: {
          colors: {
            'surface': '#ffffff',
            'input-background': '#f9f9f9',
            'highlight': '#ffff00', 
            'on-highlight': '#000000', 
            'active-row':'#eff1f1',
            'on-active-row':'#000000',   
            'hover-color': '#f7f7f7',
          },
        },
        dark: {
          colors: {
            'input-background': '#313131',
            'highlight': '#ffff00',
            'on-highlight': '#000000', 
            'active-row':'#514f4f',
            'on-active-row':'#fff',
            'hover-color': '#3f3e3e',
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
