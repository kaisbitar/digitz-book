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
    defaultTheme: "testing",
    themes: {
      // Use 'surface' for app background color,
      light: {
        colors: {
          // background: "#fff",
          // surface: "#ededed",
          "on-background": "#36454F",
          "on-surface": "#36454F",
          // // "second-background": "#f5f5f5",
          highlight: "#ffff00",
          "on-highlight": "#060603",
          // "active-row": "#bbb",
          // "on-active-row": "#000",
          // // "hover-color": "#f7f7f7",
          // "verse-number-chip": "#fafafa",
          // "on-verse-number-chip": "#7B7B7B",
          verseCount: "#5b5b5b",
          wordCount: "#5b5b5b",
          letterCount: "#5b5b5b",
          QuranCount: "#5b5b5b",
        },
      },
      dark: {
        colors: {
          // background: "#21212d",
          // surface: "#303040",
          // // "second-background": "#2b2b38",
          // // "on-surface": "#ccc",
          highlight: "#8c8c36",
          "on-highlight": "#000000",
          // "active-row": "#3e3e49",
          // "on-active-row": "#d4cfcf",
          // // "hover-color": "#3f3e3e",
          // "verse-number-chip": "#575353",
          // "on-verse-number-chip": "#000000",
          verseCount: "#9eefff",
          wordCount: "#33FF57",
          letterCount: "#ffd576",
          QuranCount: "#aad566",
        },
      },
      testing: {
        colors: {
          background: "#1E1E2E",
          surface: "#2A2A3C",
          primary: "#89B4FA",
          secondary: "#F5C2E7",
          error: "#F38BA8",
          info: "#89DCEB",
          success: "#A6E3A1",
          warning: "#FAB387",

          "surface-light": "#2a333c",
          "on-background": "#CDD6F4",
          "on-surface": "#CDD6F4",
          "on-primary": "#1E1E2E",
          "on-secondary": "#1E1E2E",
          "on-error": "#1E1E2E",
          "on-info": "#1E1E2E",
          "on-success": "#1E1E2E",
          "on-warning": "#1E1E2E",

          highlight: "#a5e3a1",
          "on-highlight": "#1E1E2E",
          "active-row": "#45475A",
          "on-active-row": "#CDD6F4",
          "hover-color": "#313244",
          "verse-number-chip": "#6C7086",
          "on-verse-number-chip": "#CDD6F4",

          verseCount: "#94E2D5",
          wordCount: "#A6E3A1",
          letterCount: "#FAB387",
          QuranCount: "#F9E2AF",
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
