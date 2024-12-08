import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Breaking the app initialization
const app = null;
app.use(router).mount('#app')

// Adding runtime errors
window.addEventListener('load', () => {
    throw new Error("Critical system failure");
    nonexistentFunction();
    undefined.property.access;
});
