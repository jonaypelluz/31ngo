import App from '@/App.vue';
import router from '@/router';
import store from '@store/index';
import { createApp } from 'vue';
import BaseButton from '@ui/BaseButton.vue';
import BaseCard from '@ui/BaseCard.vue';
import BaseCentreContainer from '@ui/BaseCentreContainer.vue';
import BaseDialog from '@ui/BaseDialog.vue';
import BaseSlide from '@ui/BaseSlide.vue';
import BaseSpinner from '@ui/BaseSpinner.vue';

const app = createApp(App);

app.component('BaseButton', BaseButton);
app.component('BaseDialog', BaseDialog);
app.component('BaseCard', BaseCard);
app.component('BaseSlide', BaseSlide);
app.component('BaseSpinner', BaseSpinner);
app.component('BaseCentreContainer', BaseCentreContainer);

app.use(store);
app.use(router);

app.mount('#app');
