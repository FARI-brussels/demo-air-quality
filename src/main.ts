import './assets/main.css'
import 'leaflet/dist/leaflet.css'
import 'fari-component-library/style'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

if (import.meta.env.MODE === 'production') {
  import('./assets/production.css')
    .then(() => console.log('Loaded production styles'))
    .catch(error => console.error('Error loading production styles:', error))
} else {
  import('./assets/local.css')
    .then(() => console.log('Loaded local styles'))
    .catch(error => console.error('Error loading local styles:', error))
}

const mode = import.meta.env.MODE

const app = createApp(App)

app.provide('mode', mode)
app.use(createPinia())
app.use(router)

app.mount('#app')
