import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.scss';

import { createLogto, type LogtoConfig } from '@logto/vue';
import CONFIG from '@/config'

const logtoConfig: LogtoConfig = {
  endpoint: CONFIG.LOGTO.ENDPOINT,
  appId: CONFIG.LOGTO.APPID,
  resources: CONFIG.LOGTO.RESOURCES
};

const app = createApp(App)

app.use(createLogto, logtoConfig);
app.use(createPinia())
app.use(router)

app.mount('#app')
