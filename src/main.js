/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Remove legacy keys from the old persist config. The full Quran is no
// longer cached in localStorage (it broke the mobile quota; it refetches).
for (const key of ['data', 'Quran', 'quran-data-store']) {
  localStorage.removeItem(key)
}

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
