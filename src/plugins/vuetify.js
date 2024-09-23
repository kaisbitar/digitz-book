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
      // defaultTheme: 'testing',
      themes: {
        // Use 'surface' for app background color,
        light: {
          colors: {
            // 'surface': '#f2ffff',
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
            'surface': '#21212d',
            'on-surface': '#f0f1f3',
            'input-background': '#313131',
            'highlight': '#8c8c36',
            'on-highlight': '#000000', 
            'active-row':'#514f4f',
            'on-active-row':'#fff',
            'hover-color': '#3f3e3e',
          },
        },
        // testing: {
        //   dark: true,
        //   colors: {
        //     background: '#1E1F23', // Keeping this from the image as '#ss' is not a valid color
        //     surface: '#21212d',
        //     // 'on-surface': '#cdcdcd',
        //     'surface-variant': '#3A3B41', // Keeping this from the previous suggestion
        //     'on-surface-variant': '#9AA0A6', // Keeping this from the previous suggestion
        //     'input-background': '#313131',
        //     highlight: '#8c8c36',
        //     'on-highlight': '#000000',
        //     'active-row': '#514f4f',
        //     'on-active-row': '#fff',
        //     // 'hover-color': '#3f3e3e',
        //     primary: '#4285F4', // Keeping these from the previous suggestion
        //     secondary: '#34A853',
        //     // error: '#EA4335',
        //     // info: '#4285F4',
        //     // success: '#34A853',
        //     // warning: '#FBBC05',
        //   }
        // }
      },
    },
    locale: {
      locale: 'ar',
      fallback: 'ar',
      messages: { ar },
    },
  })
