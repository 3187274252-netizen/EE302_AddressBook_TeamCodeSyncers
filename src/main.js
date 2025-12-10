import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 创建应用
const app = createApp(App)

// 全局配置
app.use(ElementPlus)
app.use(router)

// 挂载axios到全局
app.config.globalProperties.$axios = axios

app.mount('#app')