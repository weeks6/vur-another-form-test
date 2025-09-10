import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Nora from '@primeuix/themes/nora';

import './style.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue, {
	theme: {
		preset: Nora,
	},
});

app.mount('#app');
