import '@/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/config/router';

import type { App as AppType } from 'vue';

const app: AppType = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
