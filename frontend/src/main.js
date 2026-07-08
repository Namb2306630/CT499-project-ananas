import './assets/css/variables.css'
import './assets/css/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia' //quản lý state
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'material-symbols'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //Tự động lưu trữ và phục hồi dữ liệu của State (Pinia)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
