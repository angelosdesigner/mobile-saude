import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './plugins/echarts'
import App from './App.vue'
import router from './router'
import { dragScroll } from './directives/dragScroll'

createApp(App).use(createPinia()).use(router).directive('drag-scroll', dragScroll).mount('#app')
