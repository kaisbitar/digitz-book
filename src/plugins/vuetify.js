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
    defaultTheme: "light",
    // defaultTheme: "testing",
    themes: {
      light: {
        colors: {
          primary: "#1976D2", // A vibrant blue
          secondary: "#26A69A", // A teal color
          success: "#4CAF50", // A green color for success messages
          error: "#F44336", // A red color for error messages
          highlight: "#ffff00",
          "on-highlight": "#060603",
          "active-row": "#e4e4e4",
          "count-key-item": "#878787",
          "verse-count": "#3F51B5D9", // Deeper indigo with 85% opacity
          "word-count": "#4CAF5096", // Deeper green with 85% opacity
          "letter-count": "#FF9800D9", // Deeper amber with 85% opacity
          "Quran-count": "#E91E63D9", // Deeper pink with 85% opacity
        },
      },
      dark: {
        colors: {
          primary: "#2196F3", // A lighter blue for better contrast in dark mode
          secondary: "#4DB6AC", // A lighter teal for dark mode
          success: "#66BB6A", // A slightly lighter green for dark mode
          error: "#EF5350", // A slightly lighter red for dark mode
          highlight: "#8c8c36",
          "active-row": "#2f2f2f",
          "count-key-item": "#919191",
          "verse-count": "#3f2f6b", // Brighter purple with 85% opacity
          "word-count": "#2f9b5f", // Brighter green with 85% opacity
          "letter-count": "#FFAB00D9", // Brighter amber with 85% opacity
          "Quran-count": "#FF80ABD9", // Brighter pink with 85% opacity
        },
      },
      testing: {
        colors: {
          primary: "#89B4FA", // A soft blue that matches the existing palette
          secondary: "#F5C2E7", // A light pink that complements the theme
          success: "#A6E3A1", // A soft green that fits the pastel palette
          error: "#F38BA8", // A soft red that fits the pastel palette
          background: "#181825",
          surface: "#1E1E2E",
          "surface-light": "#2a333c",
          "on-background": "#CDD6F4",
          "on-surface": "#CDD6F4",
          highlight: "#a5e3a1",
          "active-row": "#313142",
          "count-key-item": "#919191",
          "verse-count": "#B4BEFFD9", // Lighter indigo with 85% opacity
          "word-count": "#BAF2BBD9", // Lighter green with 85% opacity
          "letter-count": "#FFE17FD9", // Lighter amber with 85% opacity
          "Quran-count": "#FFAFD9D9", // Lighter pink with 85% opacity
        },
      },
      testing2: {
        colors: {
          primary: "#3D5AFE", // Vivid indigo
          secondary: "#00BFA5", // Teal green
          success: "#00E676", // Bright green
          error: "#FF3D00", // Vivid orange-red
          background: "#FAFAFA", // Very light gray
          surface: "#FFFFFF", // Pure white
          "surface-light": "#F5F5F5", // Light gray
          "on-background": "#212121", // Very dark gray
          "on-surface": "#424242", // Dark gray
          highlight: "#FFC400", // Amber
          "active-row": "#d8f8dc2e", // Very light indigo
          "count-key-item": "#78909C", // Blue-gray
          "on-highlight": "#212121", // Very dark gray
          "verse-count": "#651FFFD9", // Vivid deep purple with 85% opacity
          "word-count": "#2979FFD9", // Vivid blue with 85% opacity
          "letter-count": "#00B0FFD9", // Vivid light blue with 85% opacity
          "Quran-count": "#1DE9B6D9", // Vivid teal with 85% opacity
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

// // "verse-count": "#94E2D5",
// // "word-count": "#A6E3A1",
// // "letter-count": "#FAB387",
// // QuranCount: "#F9E2AF",
// "count-key-item": "#919191",
