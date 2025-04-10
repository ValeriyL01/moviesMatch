import './assets/main.css'
import Lara from '@primeuix/themes/lara'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import SelectButton from 'primevue/selectbutton'
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Lara,
  },
})
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue)

app.component('app-toast', Toast)
app.component('SelectButton', SelectButton)
app.mount('#app')
