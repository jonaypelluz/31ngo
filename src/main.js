import { createApp } from 'vue';
import App from './App.vue';
import TheHeader from './components/layout/TheHeader';
import BaseButton from './components/UI/BaseButton';
import BaseCard from './components/UI/BaseCard';
import BaseCentreContainer from './components/UI/BaseCentreContainer';
import BaseDialog from './components/UI/BaseDialog';
import BaseSlide from './components/UI/BaseSlide';
import BaseSpinner from './components/UI/BaseSpinner';
import router from './router.js';
import store from './store/index.js';

const app = createApp(App);

app.component('the-header', TheHeader);
app.component('base-button', BaseButton);
app.component('base-dialog', BaseDialog);
app.component('base-card', BaseCard);
app.component('base-slide', BaseSlide);
app.component('base-spinner', BaseSpinner);
app.component('base-centre-container', BaseCentreContainer);

app.use(store);
app.use(router);

app.mount('#app');
