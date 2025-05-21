import ElementPlus from 'element-plus'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import * as _ from 'lodash'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import 'virtual:uno.css'

createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus, {
    locale: zhCN,
  })
  .mount('#app')
