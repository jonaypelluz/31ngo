import App from '@/App.vue';
import BaseButton from '@/components/UI/BaseButton.vue';
import BaseCard from '@/components/UI/BaseCard.vue';
import BaseCentreContainer from '@/components/UI/BaseCentreContainer.vue';
import BaseDialog from '@/components/UI/BaseDialog.vue';
import BaseSlide from '@/components/UI/BaseSlide.vue';
import BaseSpinner from '@/components/UI/BaseSpinner.vue';
import { createApp } from 'vue';
import router from '@/router';
import store from '@/store/index';

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
