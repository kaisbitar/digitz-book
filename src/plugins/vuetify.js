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
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    // defaultTheme: "dark",
    // defaultTheme: "light",
    // defaultTheme: "testing",
    themes: {
      // Use 'surface' for app background color,
      light: {
        colors: {
          highlight: "#ffff00",
          "on-highlight": "#060603",
          "active-row": "#e4e4e4",

          "count-key-item": "#919191",
        },
      },
      dark: {
        colors: {
          highlight: "#8c8c36",

          "active-row": "#2f2f2f",
          "count-key-item": "#919191",
        },
      },
      testing: {
        colors: {
          background: "#181825",
          surface: "#1E1E2E",

          "surface-light": "#2a333c",
          "on-background": "#CDD6F4",
          "on-surface": "#CDD6F4",

          highlight: "#a5e3a1",
          "active-row": "#313142",
          "count-key-item": "#919191",
        },
      },
    },
  },
  locale: {
    locale: "ar",
    fallback: "ar",
    messages: { ar },
  },
})
// background: "#1E1E2E",
// surface: "#1E1E2E",
// // primary: "#89B4FA",
// // secondary: "#F5C2E7",
// // error: "#F38BA8",
// // info: "#89DCEB",
// // success: "#A6E3A1",
// // warning: "#FAB387",

// "surface-light": "#2a333c",
// "on-background": "#CDD6F4",
// "on-surface": "#CDD6F4",
// // "on-primary": "#1E1E2E",
// // "on-secondary": "#1E1E2E",
// // "on-error": "#1E1E2E",
// // "on-info": "#1E1E2E",
// // "on-success": "#1E1E2E",
// "on-warning": "#1E1E2E",

// highlight: "#a5e3a1",
// "active-row": "#45475A",
// // "on-highlight": "#1E1E2E",
// // "on-active-row": "#CDD6F4",
// // "hover-color": "#313244",
// // "verse-number-chip": "#6C7086",
// // "on-verse-number-chip": "#CDD6F4",

// // verseCount: "#94E2D5",
// // wordCount: "#A6E3A1",
// // letterCount: "#FAB387",
// // QuranCount: "#F9E2AF",
// "count-key-item": "#919191",
