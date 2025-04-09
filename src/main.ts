import './assets/main.css'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ProgressBar from 'primevue/progressbar'
const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue)
app.component('app-toast', Toast)
app.component('ProgressBar', ProgressBar)
app.mount('#app')
