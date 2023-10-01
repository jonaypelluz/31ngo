import { createApp } from 'vue';
import App from '@/App.vue';

import TheHeader from '@/components/layout/TheHeader.vue';
import BaseButton from '@/components/UI/BaseButton.vue';
import BaseCard from '@/components/UI/BaseCard.vue';
import BaseCentreContainer from '@/components/UI/BaseCentreContainer.vue';
import BaseDialog from '@/components/UI/BaseDialog.vue';
import BaseSlide from '@/components/UI/BaseSlide.vue';
import BaseSpinner from '@/components/UI/BaseSpinner.vue';

import router from '@/router.js';
import store from '@/store/index.js';

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
