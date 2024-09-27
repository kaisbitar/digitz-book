/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { createVuetify } from "vuetify"
import { ar } from "vuetify/locale"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    // defaultTheme: "light",
    // defaultTheme: 'testing',
    themes: {
      // Use 'surface' for app background color,
      light: {
        colors: {
          surface: "#ededed",
          "second-background": "#f5f5f5",
          "input-background": "#fff",
          highlight: "#ffff00",
          "on-highlight": "#000000",
          "active-row": "#353540",
          "on-active-row": "#000",
          "hover-color": "#f7f7f7",
          "verse-number-chip": "#fafafa",
          "on-verse-number-chip": "#7B7B7B",
        },
      },
      dark: {
        colors: {
          surface: "#21212d",
          "second-background": "#2b2b38",
          "on-surface": "#ccc",
          "input-background": "#313131",
          highlight: "#8c8c36",
          "on-highlight": "#000000",
          "active-row": "#3e3e49",
          "on-active-row": "#d4cfcf",
          "hover-color": "#3f3e3e",
          "verse-number-chip": "#575353",
          "on-verse-number-chip": "#000000",
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
    locale: "ar",
    fallback: "ar",
    messages: { ar },
  },
})
