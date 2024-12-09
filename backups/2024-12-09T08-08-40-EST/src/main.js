import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create the app
const app = createApp(App)

// Create and use Pinia store
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Mount the app
app.mount('#app')
